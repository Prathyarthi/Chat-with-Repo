import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const getRepoContext = async (repoUrl: string) => {
    const loader = new GithubRepoLoader(repoUrl, {
        branch: "main",
        recursive: true,
        ignoreFiles: ['package.json', 'package-lock.json', 'yarn.lock', 'node_modules', 'dist', 'build', 'out', 'public', 'coverage', '.git', '.github', '.vscode', '.idea', '.gitignore', '.npmignore', '.eslintrc.js', '.prettierrc.js', '.babelrc.js', '.env', '.env.local', '.env.development', '.env.test', '.env.production', '.env'],
        unknown: 'warn',
        maxConcurrency: 5
    });
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 100,
    });

    const splitDocs = await splitter.splitDocuments(docs);
    return splitDocs;
};
