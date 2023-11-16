import { execCommandInDir } from "./exec.js";

// Default source branch
const branch_name = "auto-update-version-bot";
const create_branch = `git checkout -B ${branch_name}`;
const commit_and_push = `git commit -m "dependency update" && git push --set-upstream origin ${branch_name}`;

// Dependency bot name and email for commit and push
export const set_bot__user_name =
  "git config user.name l9waxxfgue3c3ce6g36mzinyfuyg48";
  
export const set_bot_user_email =
  "git config user.email l9waxxfgue3c3ce6g36mzinyfuyg48@bots.bitbucket.org";

export const bearer_auth_token = (access_token) =>
  `Authorization: Bearer ${access_token}`;
export const x_auth_token = (access_token) =>
  `https://x-token-auth:${access_token}`;

export const createGitRemoteCommand = (
  command,
  workspace,
  slug,
  access_token
) => {
  return `git ${command} ${x_auth_token(
    access_token
  )}@bitbucket.org/${workspace}/${slug}`;
};

export const commitAndPushChanges = async (
  SLUG,
) => {
  await execCommandInDir(SLUG, create_branch);
  await execCommandInDir(SLUG, "ls -la");
  await execCommandInDir(SLUG, "git add package.json");
  await execCommandInDir(
    SLUG,
    `${set_bot__user_name} && ${set_bot_user_email}`
  );
  await execCommandInDir(SLUG, commit_and_push);
};

export const createPullRequest = (
  access_token,
  workspace,
  slug,
  dependency_name,
  version
) => {
  const pr_content = {
    title: `Auto update dependency ${dependency_name}`,
    description: `There is new version ${version} of ${dependency_name}`,
    source: { branch: { name: branch_name } },
    destination: { branch: { name: "main" } },
  };
  return `curl -X POST -H "Content-Type: application/json" -H '${bearer_auth_token(
    access_token
  )}' -d '${JSON.stringify(
    pr_content
  )}' "https://api.bitbucket.org/2.0/repositories/${workspace}/${slug}/pullrequests"`;
};
