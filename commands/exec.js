import { exec as _exec } from "child_process";
import util from "util";
const exec = util.promisify(_exec);

export const execCommand = async (command) => {
  console.log(`fn execCommand. Start executing: ${command}`);
  try {
    const { stdout, stderr } = await exec(command);
    if (stdout) {
      console.log("stdout:", stdout);
      return stdout;
    }
    console.error("stderr:", stderr);
  } catch (error) {
    console.error("Error executing command:", error);
    throw error;
  }
  console.log(`fn execCommand. End of exec: ${command}`);
};

export const execCommandInDir = async (dir, command) => {
  console.log(`fn execCommandInDir. Start executing: ${command}`);
  try {
    const { stdout, stderr } = await exec(`cd ${dir} && ${command}`);
    if (stdout) {
      console.log("stdout:", stdout);
      return stdout;
    }
    console.error("stderr:", stderr);
  } catch (error) {
    console.error("Error executing command:", error);
    throw error;
  }
  console.log(`fn execCommandInDir. End of exec: ${command}`);
};
