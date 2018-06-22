const readline = require(`readline`);
const fs = require(`fs`);
const fse = require(`fs-extra`);
const promisify = require(`util`).promisify;
const access = promisify(fs.access);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);
const path = require(`path`);

let state;
let rl;

const QUESTIONS = {
  DEFAULT: {
    TYPE: `question-default`,
    STRING: `Do sort files?(y/n)`
  },
  PATH_TO_SORT: {
    TYPE: `question-sort`,
    STRING: `Specify the path to the folder in which you want to sort files: `
  },
  PATH_TO_RESULT: {
    TYPE: `question-result`,
    STRING: `Specify the path to the folder where to put the result: `
  },
  DELETE: {
    TYPE: `question-delete`,
    STRING: `Delete the original folder?(y/n)`
  }
};

const ANSWER = {
  YES: `y`,
  NO: `n`
};

const ERROR = {
  PATH: `There is no such way!`,
  OTHER: `Incorrect answer!`
};

const INFO = {
  WAITING: `waiting...`,
  DELETE_DIR (name) {
    return `directory ${name} is deleted`;
  },
  DATA_SORT: `files to be sorted`,
  DATA_NOT_SORT: `files to be not sorted`
};

const reducer = async (question, answer) => {
  switch (question) {
    case QUESTIONS.DEFAULT.TYPE:
      switch (answer) {
        case ANSWER.YES:
          state = { ...state, question: QUESTIONS.PATH_TO_SORT };
          break;
        case ANSWER.NO:
          state = null;
          break;

        default:
          state = null;
          console.log(ERROR.OTHER);
      }
      break;

    case QUESTIONS.PATH_TO_SORT.TYPE:
      state = { ...state, pathToSort: answer };
      console.log(INFO.WAITING);
      try {
        access(state.pathToSort, fs.constants.W_OK);
        state = { ...state, question: QUESTIONS.PATH_TO_RESULT };
      } catch (e) {
        state = null;
        console.log(ERROR.PATH);
      }
      break;

    case QUESTIONS.PATH_TO_RESULT.TYPE:
      state = { ...state, pathToResult: answer };
      console.log(INFO.WAITING);
      try {
        await access(state.pathToResult, fs.constants.W_OK);
        state = { ...state, question: QUESTIONS.DELETE };
      } catch (e) {
        state = null;
        console.log(ERROR.PATH);
      }
      break;

    case QUESTIONS.DELETE.TYPE:
      const deleteFolder = answer === ANSWER.YES;
      state = { ...state, deleteFolder };
      console.log(INFO.WAITING);
      try {
        await toSort(state.pathToSort);
        if (deleteFolder) await fse.remove(state.pathToSort);
        console.log(INFO.DATA_SORT);
      } catch (e) {
        console.log(INFO.DATA_NOT_SORT);
      }
      state = null;
      break;
  }

  nextStep();
};

const initialState = {
  question: QUESTIONS.DEFAULT,
  pathToSort: ``,
  pathToResult: ``,
  deleteFolder: false
};

const nextStep = () => {
  if (state !== null) {
    rl.question(state.question.STRING, (answer) => {
      reducer(state.question.TYPE, answer);
    });
  } else {
    rl.close();
  }
};

async function getFiles (dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.reduce((a, f) => a.concat(f), []);
}

const toSort = async (pathToSort) => {
  const { pathToResult } = state;
  const files = await getFiles(pathToSort);
  await Promise.all(files.map(async (filePath) => {
    const file = path.parse(filePath);
    if (file.name.charAt(0) !== '.') {
      const resultPath = path.join(pathToResult, file.name.charAt(0));

      try {
        await access(resultPath);
      } catch (e) {
        await mkdir(resultPath);
      }

      return copyFile(filePath, path.join(resultPath, file.name));
    }
  }));
};

module.exports = {
  description: `sorts files by name`,
  name: `--sort`,
  execute () {
    state = { ...initialState };

    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    nextStep();
  }
};
