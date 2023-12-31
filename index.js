import { config } from "dotenv";
config();
import {
  createGitRemoteCommand,
  commitAndPushChanges,
  createPullRequest,
} from "./commands/git.js";
import { execCommand } from "./commands/exec.js";
import { readPackage } from "read-pkg";
import { compare } from "compare-versions";
import fs from "fs";

const { PACKAGE_NAME, PACKAGE_NEW_VERSION, WORKSPACE, SLUG, ACCESS_TOKEN } =
  process.env;

const runAutoUpdate = async () => {
  try {
    checkMissingKeys({
      PACKAGE_NAME,
      PACKAGE_NEW_VERSION,
      WORKSPACE,
      SLUG,
      ACCESS_TOKEN,
    });

    //clone repo
    //TODO: maybe find solution for not pulling entire project, just single package.json
    await execCommand(
      createGitRemoteCommand("clone", WORKSPACE, SLUG, ACCESS_TOKEN)
    );

    // parse package.json from cloned project
    const parsedPackage = await readPackage({ cwd: SLUG });

    //get version of current version
    const current_dependency_version =
      parsedPackage?.dependencies[PACKAGE_NAME];

      // check if version is newer
    if (current_dependency_version) {
      const isPackageVersionGraterThanExisting = compare(
        current_dependency_version,
        PACKAGE_NEW_VERSION,
        "<"
      );

      if (!isPackageVersionGraterThanExisting) {
        console.log(
          `Client version is equals or newer. Client version: ${parsedPackage.dependencies[PACKAGE_NAME]}, incoming version ${PACKAGE_NEW_VERSION}`
        );
        return;
      }

      //write new dependency version into package.json
      // JSON.stringify(parsedPackage, null, 2) makes json more pretty and readable
      parsedPackage.dependencies[PACKAGE_NAME] = PACKAGE_NEW_VERSION;
      fs.writeFileSync(
        `${SLUG}/package.json`,
        JSON.stringify(parsedPackage, null, 2)
      );

      //TODO: add handle of each operation to make error messages more informative
      await commitAndPushChanges(SLUG);
      await execCommand(
        createPullRequest(
          ACCESS_TOKEN,
          WORKSPACE,
          SLUG,
          PACKAGE_NAME,
          PACKAGE_NEW_VERSION
        )
      );
    }
  } catch (error) {
    console.log("There is some error: ", error);
  } finally {
    //removing cloned project after any scenario
    await execCommand(`rm -rf ${SLUG}`);
  }
};


// Check if there is no missing key value 
const checkMissingKeys = (keys) => {
  const missing = [];
  for (const [key, value] of Object.entries(keys)) {
    if (typeof value === "undefined") {
      missing.push(key);
    }
  }
  if (missing.length > 0)
    throw `Missing client data in .env : ${missing.toString()}`;
};

runAutoUpdate();
