/**
 * A variant of {@link FieldKeyPath} that can include type information for fields with variable
 * types. The syntax uses angle brackets to enclose the type, e.g. `blocks.*<image>.src` (for a
 * variable type List field; a list index is replaced with an asterisk) or `field<button>.label`
 * (for a variable type Object field).
 */
export type TypedFieldKeyPath = string;
/**
 * ISO 639-1 locale code or `_default` for the unspecified default content locale. And `_` is a
 * special one that can be used to hold locale-agnostic data.
 */
export type InternalLocaleCode = LocaleCode | "_default" | "_";
/**
 * CMS configuration extra properties for internal use.
 */
export type CmsConfigExtraProps = {
    /**
     * `site_url` or the current `location.origin` if it’s not set.
     */
    _siteURL: string;
    /**
     * The base/origin of `_siteURL`.
     */
    _baseURL: string;
};
/**
 * CMS configuration for internal use.
 */
export type InternalCmsConfig = CmsConfig & CmsConfigExtraProps;
/**
 * User details. Most properties are from the GitHub API. The properties other than `backendName`
 * are not available for the local backend.
 */
export type User = {
    /**
     * Backend name, e.g. `github`.
     */
    backendName: BackendName | "local";
    /**
     * Backend OAuth access token.
     */
    token?: string | undefined;
    /**
     * Backend OAuth refresh token.
     */
    refreshToken?: string | undefined;
    /**
     * User ID.
     */
    id?: number | undefined;
    /**
     * User display name.
     */
    name?: string | undefined;
    /**
     * User account name.
     */
    login?: string | undefined;
    /**
     * User email.
     */
    email?: string | undefined;
    /**
     * Avatar URL.
     */
    avatarURL?: string | undefined;
    /**
     * Profile URL.
     */
    profileURL?: string | undefined;
    /**
     * Whether the user is a service account.
     */
    bot?: boolean | undefined;
};
/**
 * User preferences.
 */
export type Preferences = {
    /**
     * API keys for integrations.
     */
    apiKeys?: Record<string, string> | undefined;
    /**
     * Log-in credentials (user name and password) for
     * integrations.
     */
    logins?: Record<string, string> | undefined;
    /**
     * Selected UI theme, or `auto` to follow the system’s
     * color scheme.
     */
    theme?: "auto" | "dark" | "light" | undefined;
    /**
     * Selected UI locale, e.g. `en-US`, or `auto` to
     * follow the browser’s language settings.
     */
    locale?: string | undefined;
    /**
     * Whether to use the entry draft backup mechanism.
     */
    useDraftBackup?: boolean | undefined;
    /**
     * Whether to close the entry editor after saving a draft.
     */
    closeOnSave?: boolean | undefined;
    /**
     * Whether to close the entry editor by pressing the Escape
     * key.
     */
    closeWithEscape?: boolean | undefined;
    /**
     * Whether to always underline links.
     */
    underlineLinks?: boolean | undefined;
    /**
     * Whether to enable beta features.
     */
    beta?: boolean | undefined;
    /**
     * Whether to enable the developer mode.
     */
    devModeEnabled?: boolean | undefined;
    /**
     * Webhook URL to manually trigger a new deployment on any
     * connected CI/CD provider.
     */
    deployHookURL?: string | undefined;
    /**
     * Webhook `Authorization` request header value, including
     * the scheme and token, e.g. `Bearer <token>`.
     */
    deployHookAuthHeader?: string | undefined;
    /**
     * Default translation service ID, e.g. `google`.
     */
    defaultTranslationService?: string | undefined;
};
/**
 * Basic Git repository information retrieved from the config file.
 */
export type RepositoryBaseInfo = {
    /**
     * Repository hosting service name, e.g. `github`.
     */
    service: GitBackendName | "";
    /**
     * Service label, e.g. `GitHub`.
     */
    label: string;
    /**
     * Owner name, which could be either an organization or individual user.
     */
    owner: string;
    /**
     * Repository name.
     */
    repo: string;
    /**
     * Branch name, e.g. `master` or `main`.
     */
    branch?: string | undefined;
    /**
     * The repository’s web-accessible URL that can be linked from the CMS
     * UI to the backend service. Git backends only.
     */
    repoURL?: string | undefined;
    /**
     * URL of the page where the user can create a personal access
     * token (PAT). Git backends only.
     */
    tokenPageURL?: string | undefined;
    /**
     * Whether the repository is on a GitHub Enterprise Server or
     * GitLab Self-Managed, or self-hosted Gitea/Forgejo instance.
     */
    isSelfHosted?: boolean | undefined;
    /**
     * IndexedDB database name. Git backends only.
     */
    databaseName?: string | undefined;
};
/**
 * List of URLs for the repository’s web interface to access different resources, which can be used
 * in the CMS UI to link to the backend service.
 */
export type RepositoryBaseURLs = {
    /**
     * Repository’s tree base URL with a branch name. It’s the same as
     * `baseURL` when the default branch is used. Git backends only.
     */
    treeBaseURL?: string | undefined;
    /**
     * Repository’s blob base URL with a branch name. Git backends
     * only.
     */
    blobBaseURL?: string | undefined;
    /**
     * Repository’s commit base URL. Append a SHA to get a commit
     * URL. Git backends only.
     */
    commitBaseURL?: string | undefined;
};
/**
 * Complete repository information used in the CMS, which combines the basic repository info from
 * the config file and the generated base URLs.
 */
export type RepositoryInfo = RepositoryBaseInfo & RepositoryBaseURLs;
/**
 * The owner and name of a repository, which is all that’s needed to address it in an API request.
 * Used for the fork an Open Authoring contributor writes to, which is a different repository from
 * the configured one described by {@link RepositoryInfo}.
 */
export type RepositoryPath = {
    /**
     * Owner name, which could be either an organization or individual user.
     */
    owner: string;
    /**
     * Repository name.
     */
    repo: string;
};
/**
 * An outstanding request for the user’s permission to fork the configured repository, which the UI
 * turns into a confirmation dialog.
 */
export type ForkPermissionRequest = {
    /**
     * Repository path to be forked, e.g. `owner/repo`.
     */
    repo: string;
    /**
     * Function to answer the request, which resolves the
     * promise the sign-in flow is waiting on.
     */
    respond: (granted: boolean) => void;
};
/**
 * API endpoint configuration.
 */
export type ApiEndpointConfig = {
    /**
     * OAuth client ID.
     */
    clientId: string;
    /**
     * OAuth scope.
     */
    authScope: string;
    /**
     * OAuth authorization URL.
     */
    authURL: string;
    /**
     * OAuth token URL.
     */
    tokenURL: string;
    /**
     * Authorization scheme. Default is `token`.
     */
    authScheme?: string | undefined;
    /**
     * REST API endpoint, e.g. `/api/v3`.
     */
    restBaseURL: string;
    /**
     * GraphQL API endpoint, e.g. `/api/graphql`.
     */
    graphqlBaseURL?: string | undefined;
    /**
     * Whether to include credentials (e.g. cookies) in all API
     * and token requests. Corresponds to the `include_credentials` backend config option.
     */
    includeCredentials?: boolean | undefined;
};
/**
 * Fetch API options.
 */
export type FetchApiOptions = {
    /**
     * HTTP method. The default is `GET`.
     */
    method?: string | undefined;
    /**
     * HTTP headers. The default is an empty object.
     */
    headers?: Record<string, string> | undefined;
    /**
     * HTTP body. The default is `null`.
     */
    body?: any;
    /**
     * Whether the request is a GraphQL request. The default is `false`.
     */
    isGraphQL?: boolean | undefined;
    /**
     * Response type. The default is `json`,
     * while `raw` returns the `Response` object as is.
     */
    responseType?: "raw" | "text" | "blob" | "json" | undefined;
    /**
     * OAuth access token. If not provided, it will be taken from the `user`
     * store.
     */
    token?: string | undefined;
    /**
     * OAuth refresh token. If not provided, it will be taken from the
     * `user` store.
     */
    refreshToken?: string | undefined;
};
/**
 * Options for a commit operation in the backend.
 */
export type CommitOptions = {
    /**
     * Commit type. Used only for Git backends.
     */
    commitType: CommitType;
    /**
     * Collection of the corresponding entry or asset.
     */
    collection?: InternalCollection | undefined;
    /**
     * Whether to disable automatic deployments for the commit. Used only
     * for Git backends.
     */
    skipCI?: boolean | undefined;
    /**
     * Branch to commit to. Default: the branch configured in the site
     * configuration. Used only for Git backends with Editorial Workflow enabled.
     */
    branch?: string | undefined;
    /**
     * Git object ID the branch is known to point at. It saves the backend
     * a round trip to look the head up itself, which the caller can provide when it has just created
     * the branch. Used only for Git backends with Editorial Workflow enabled.
     */
    headOid?: string | undefined;
    /**
     * Branch to create the `branch` from as part of the commit, which
     * saves the round trip of creating it beforehand. The commit is rejected if the branch already
     * exists. Used only for Git backends with Editorial Workflow enabled.
     */
    startBranch?: string | undefined;
};
/**
 * Results of a commit operation.
 */
export type CommitResults = {
    /**
     * Git object ID (SHA-1 hash) of the commit. It’s a pseudo hash for the local
     * backend.
     */
    sha: string;
    /**
     * Git committer info for a Git backend.
     */
    author?: CommitAuthor | undefined;
    /**
     * Commit date for a Git backend.
     */
    date?: Date | undefined;
    /**
     * Map of committed files. The key is
     * a file path, and the value is an object containing the Git object ID of the updated file. The
     * blob object is also included for the local backend.
     */
    files: Record<string, {
        sha: string;
        file?: Blob;
    }>;
};
/**
 * Change results containing the commit information, saved entries, and saved assets.
 */
export type ChangeResults = {
    /**
     * Commit results.
     */
    commit: CommitResults;
    /**
     * List of saved entries.
     */
    savedEntries: Entry[];
    /**
     * List of saved assets.
     */
    savedAssets: Asset[];
};
/**
 * What someone else’s commits have changed on the configured branch, as found by a check made after
 * the site data was loaded. A modified entry is listed as it is now; a deleted one as it was.
 */
export type RemoteChanges = {
    /**
     * Entries that weren’t there before.
     */
    addedEntries: Entry[];
    /**
     * Entries whose files have changed.
     */
    modifiedEntries: Entry[];
    /**
     * Entries whose files are gone.
     */
    deletedEntries: Entry[];
    /**
     * Assets that weren’t there before.
     */
    addedAssets: Asset[];
    /**
     * Assets whose files have changed.
     */
    modifiedAssets: Asset[];
    /**
     * Assets whose files are gone.
     */
    deletedAssets: Asset[];
};
/**
 * State of a deployment created by a CI/CD provider connected to the Git backend.
 * - `checking`: a request to the backend is in flight, or nothing has been reported yet for a
 * commit made moments ago and the provider is being given time to post its first status.
 * - `pending`: the build is queued or running, or the page is not live yet.
 * - `ready`: the build succeeded and the page is live.
 * - `error`: the build failed.
 * - `unknown`: no CI/CD provider reported anything, or the lookup itself failed. The UI falls back
 * to the plain site preview link in this case.
 */
export type DeployState = "checking" | "pending" | "ready" | "error" | "unknown";
/**
 * A commit to look up a deployment for.
 */
export type DeployTarget = {
    /**
     * Git object ID (SHA-1 hash) of the commit.
     */
    sha: string;
    /**
     * Branch the commit is on. It’s needed by services that can only filter
     * deployments by ref, such as GitLab.
     */
    branch: string;
    /**
     * Kind of deployment expected for the commit, used to
     * break ties between environments. A commit on the production branch gets `production`, while an
     * Editorial Workflow pull request gets `preview`.
     */
    kind: "production" | "preview";
};
/**
 * A deployment resolved from a backend’s CI/CD integration.
 */
export type DeployStatus = {
    /**
     * Current state.
     */
    state: DeployState;
    /**
     * Base URL of the deployment, without a trailing slash. It can be
     * `undefined` while the build is still `pending`, because a URL isn’t always assigned upfront.
     */
    url?: string | undefined;
    /**
     * Commit status context or deployment environment the URL came from.
     */
    context?: string | undefined;
    /**
     * Time when the backend was last queried, as a Unix timestamp in
     * milliseconds.
     */
    checkedTime: number;
};
/**
 * What the last commit on the production branch is expected to have done, worked out without asking
 * the CI/CD provider.
 */
export type PublishHint = {
    /**
     * Whether the commit is expected to have started a deployment.
     */
    published: boolean;
    /**
     * When the expectation was formed, as a Unix timestamp in milliseconds. A
     * deployment read before this point describes an earlier state of the same commit, so it’s ignored
     * until the next lookup.
     */
    time: number;
};
/**
 * Result of a liveness check against a fully composed preview URL.
 * - `ready`: the page returned a 2xx status.
 * - `pending`: the page returned 404, meaning it hasn’t been built yet.
 * - `unknown`: the response couldn’t be read. The URL is cross-origin, so the check was skipped, or
 * the server returned some other status.
 */
export type PageLiveness = "ready" | "pending" | "unknown";
/**
 * A preview link resolved for one entry and locale, composed from the site configuration and the
 * deployment stores.
 */
export type EntryPreviewLink = {
    /**
     * URL to open. It’s `undefined` while a build has no URL yet, in which
     * case the UI shows a disabled control instead of a link.
     */
    url?: string | undefined;
    /**
     * Current state, as reported by the CI/CD provider. The liveness of
     * the URL is not folded in here; apply `refineState()` to do that.
     */
    state: DeployState;
    /**
     * Whether the URL points at a deploy preview rather than the
     * production site.
     */
    isDeployPreview: boolean;
    /**
     * Whether a deploy preview is expected for the entry but hasn’t
     * been reported yet. The URL, if any, leads to the published version or nowhere, so the control
     * reports the wait rather than offering it.
     */
    awaitingPreview: boolean;
    /**
     * Whether the URL is worth checking for liveness. It’s `false` for a
     * page that can’t be live yet, such as an unpublished entry falling back to the production site.
     */
    pingable: boolean;
};
/**
 * Options for the `signIn` function on {@link BackendService}.
 */
export type SignInOptions = {
    /**
     * Whether the sign-in process is automatic.
     */
    auto: boolean;
    /**
     * User’s locally-cached OAuth access token. Git backends only.
     */
    token?: string | undefined;
    /**
     * User’s locally-cached OAuth refresh token. Git backends only.
     */
    refreshToken?: string | undefined;
};
/**
 * OAuth access token and refresh token.
 */
export type AuthTokens = {
    /**
     * User’s locally-cached OAuth access token. Git backends only.
     */
    token: string;
    /**
     * User’s locally-cached OAuth refresh token. Git backends only.
     * This is optional because earlier versions of Sveltia CMS did not support refresh tokens.
     */
    refreshToken?: string | undefined;
};
/**
 * The current status of a Git backend service.
 */
export type BackendServiceStatus = "none" | "minor" | "major" | "unknown";
/**
 * Backend service.
 */
export type BackendService = {
    /**
     * Whether the backend is a Git service.
     */
    isGit: boolean;
    /**
     * Service name, e.g. `github`.
     */
    name: string;
    /**
     * Service label, e.g. `GitHub`.
     */
    label: string;
    /**
     * Basic repository info. Git and local backends only.
     */
    repository?: RepositoryInfo | undefined;
    /**
     * URL of status dashboard page of the service. Git backends
     * only.
     */
    statusDashboardURL?: string | undefined;
    /**
     * Function to check the backend
     * service’s status. Git backends only.
     */
    checkStatus?: (() => Promise<BackendServiceStatus>) | undefined;
    /**
     * Function to initialize the backend.
     */
    init: () => RepositoryInfo | undefined;
    /**
     * Function to sign in.
     */
    signIn: (options: SignInOptions) => Promise<User | void>;
    /**
     * Function to sign out.
     */
    signOut: () => Promise<void>;
    /**
     * Function to fetch files. Calling it again once the site data has been loaded brings
     * the stores up to date with the repository, fetching only what has changed. A Git backend takes
     * the branch’s last commit, if the caller has just fetched it, so it isn’t fetched again.
     */
    fetchFiles: (options?: {
        lastCommit?: {
            hash: string;
            message: string;
        };
    }) => Promise<void>;
    /**
     * Function to fetch
     * the configured branch’s head commit, to tell whether the repository has changed since the site
     * data was loaded. Git backends only.
     */
    fetchLastCommit?: (() => Promise<{
        hash: string;
        message: string;
    }>) | undefined;
    /**
     * Function to fetch an asset as a Blob. Git
     * backends only.
     */
    fetchBlob?: ((asset: Asset) => Promise<Blob>) | undefined;
    /**
     * Function to save file changes, including additions and deletions, and return the
     * commit hash and a map of committed files.
     */
    commitChanges: (changes: FileChange[], options: CommitOptions) => Promise<CommitResults>;
    /**
     * Function to manually trigger a new
     * deployment on any connected CI/CD provider. GitHub only.
     */
    triggerDeployment?: (() => Promise<Response>) | undefined;
    /**
     * Function to resolve the head
     * commit of the configured branch, which is the production deployment target. Git backends only.
     */
    fetchBranchHeadSHA?: (() => Promise<string | undefined>) | undefined;
    /**
     * Function to resolve the deployment status and URL for the given commits, keyed by commit SHA. Git
     * backends only, and only when the service exposes deployment or commit status information.
     */
    fetchDeployments?: ((targets: DeployTarget[]) => Promise<Record<string, DeployStatus>>) | undefined;
    /**
     * Function to fetch
     * commit history for given file paths. Git backends only.
     */
    fetchFileCommits?: ((paths: string[]) => Promise<FileCommit[]>) | undefined;
    /**
     * Editorial Workflow implementation. Git backends
     * only, and only when the backend supports the feature.
     */
    workflow?: WorkflowBackendService | undefined;
};
/**
 * Editorial Workflow status of an unpublished entry. The status is stored as a label on the
 * corresponding pull request, prefixed with the `cms_label_prefix` backend option value.
 */
export type WorkflowStatus = "draft" | "pending_review" | "pending_publish" | "pending_deletion";
/**
 * An entry whose pull request has been merged, and whose change is on its way to the site.
 */
export type DeployingEntry = {
    /**
     * Entry as it was published, with the workflow properties it
     * had: the status says whether the merge removed the entry from the site rather than putting it
     * there, and the pull request’s `updatedDate` is when the merge landed.
     */
    entry: UnpublishedEntry;
    /**
     * Head commit of the configured branch once the merge had landed, which the
     * site is being built from.
     */
    sha: string;
};
/**
 * A file included in an Editorial Workflow pull request.
 */
export type WorkflowFile = {
    /**
     * File path relative to the project’s root directory.
     */
    path: string;
    /**
     * Git object ID (SHA-1 hash) of the file blob.
     */
    sha: string;
    /**
     * File size in bytes.
     */
    size: number;
    /**
     * Raw text content. `undefined` for binary files.
     */
    text?: string | undefined;
    /**
     * Whether the file has been deleted in the pull request.
     */
    deleted: boolean;
    /**
     * Whether the pull request renamed the file, which happens when the
     * entry’s slug is edited. GitHub’s GraphQL API reports this without the previous path, so it marks
     * the pull requests that need a follow-up REST request.
     */
    renamed?: boolean | undefined;
    /**
     * Path the file had before the pull request renamed it.
     */
    previousPath?: string | undefined;
};
/**
 * A pull request that holds an unpublished entry created with Editorial Workflow.
 */
export type WorkflowPullRequest = {
    /**
     * Pull request number. It’s `undefined` for an Open Authoring draft,
     * which is a branch in the contributor’s fork that no pull request has been opened for yet.
     */
    number?: number | undefined;
    /**
     * Global node ID used with the backend’s GraphQL API. `undefined` in
     * the same case as `number`.
     */
    nodeId?: string | undefined;
    /**
     * Pull request URL on the backend service. `undefined` in the same case as
     * `number`.
     */
    url?: string | undefined;
    /**
     * Pull request title.
     */
    title: string;
    /**
     * Head branch name, e.g. `cms/posts/hello-world`.
     */
    branch: string;
    /**
     * Current status determined by the pull request’s labels.
     */
    status: WorkflowStatus;
    /**
     * Date when the pull request was created.
     */
    createdDate: Date;
    /**
     * Date when the pull request was last updated.
     */
    updatedDate: Date;
    /**
     * Author of the pull request.
     */
    author?: CommitAuthor | undefined;
    /**
     * Git object ID (SHA-1 hash) of the head commit on the pull request’s
     * branch. It’s used to look up the deploy preview created for the pull request.
     */
    headSHA?: string | undefined;
    /**
     * Files changed in the pull request.
     */
    files: WorkflowFile[];
    /**
     * Whether the signed-in user can merge the pull request, which
     * decides whether the entry can be published. `undefined` when the backend doesn’t tell, in which
     * case the merge is offered and left to the backend to allow or refuse.
     */
    canMerge?: boolean | undefined;
};
/**
 * Editorial Workflow properties attached to an unpublished entry.
 */
export type UnpublishedEntryProps = {
    /**
     * Pull request holding the entry.
     */
    pullRequest: WorkflowPullRequest;
    /**
     * Current status. Same as `pullRequest.status`, duplicated here
     * for convenience and reactivity.
     */
    status: WorkflowStatus;
    /**
     * Collection name the entry belongs to.
     */
    collectionName: string;
    /**
     * Collection file name. File/singleton collection only.
     */
    fileName?: string | undefined;
    /**
     * File paths the entry occupied before the pull request
     * renamed it, which happens when the slug is edited. They’re used to match the draft with its
     * published counterpart, which would otherwise be listed as a separate entry.
     */
    previousPaths?: string[] | undefined;
};
/**
 * An entry that has not been published yet, backed by an open pull request. It’s a regular
 * {@link Entry} with extra Editorial Workflow information, so it can be passed to the existing
 * entry editor and list components as is.
 */
export type UnpublishedEntry = Entry & {
    workflow: UnpublishedEntryProps;
};
/**
 * A file changed by a pull request, as read by {@link WorkflowBackendService.fetchMergeState}.
 */
export type WorkflowChangedFile = {
    /**
     * File path relative to the project’s root directory.
     */
    path: string;
    /**
     * How the pull request changes the
     * file.
     */
    status: "added" | "modified" | "removed" | "renamed";
    /**
     * Path a renamed file had before.
     */
    previousPath?: string | undefined;
    /**
     * Git file mode at the head commit, as an octal string, e.g. `100644`
     * for a regular file, `120000` for a symbolic link or `160000` for a submodule. Missing for a
     * removed file.
     */
    mode?: string | undefined;
};
/**
 * State of a pull request read right before it’s merged.
 */
export type WorkflowMergeState = {
    /**
     * Git object ID of the commit the pull request’s branch
     * points at.
     */
    headSHA: string | undefined;
    /**
     * Whether the pull request goes from a branch of the
     * configured repository, rather than a fork, to the configured branch, which its base branch can be
     * changed from on the Git service.
     */
    onConfiguredBranches: boolean;
    /**
     * Files the pull request changes as of `headSHA`.
     */
    files: WorkflowChangedFile[];
    /**
     * Whether `files` lists every changed file. The Git services cap the
     * list, and a pull request over the cap can’t be checked.
     */
    complete: boolean;
};
/**
 * Arguments for the `saveEntry` function on {@link WorkflowBackendService}.
 */
export type WorkflowSaveOptions = {
    /**
     * Changes to be committed on the workflow branch.
     */
    changes: FileChange[];
    /**
     * Commit options.
     */
    options: CommitOptions;
    /**
     * Workflow branch name.
     */
    branch: string;
    /**
     * Pull request title.
     */
    title: string;
    /**
     * Status to open the pull request with. An edit starts as a
     * draft, while a removal goes straight to `pending_deletion`, so it isn’t opened as a draft and
     * relabelled a moment later.
     */
    status: WorkflowStatus;
    /**
     * Existing pull request, if the entry has already
     * been saved once.
     */
    pullRequest?: WorkflowPullRequest | undefined;
};
/**
 * Editorial Workflow implementation provided by a backend service.
 */
export type WorkflowBackendService = {
    /**
     * Function to fetch all the open
     * pull requests managed by the CMS, along with the changed files.
     */
    fetchPullRequests: () => Promise<WorkflowPullRequest[]>;
    /**
     * Function to commit changes on the workflow branch,
     * creating the branch and the pull request if needed.
     */
    savePullRequest: (args: WorkflowSaveOptions) => Promise<{
        commit: CommitResults;
        pullRequest: WorkflowPullRequest;
    }>;
    /**
     * Function to update the pull request’s status label and
     * draft state.
     */
    updateStatus: (pullRequest: WorkflowPullRequest, status: WorkflowStatus) => Promise<WorkflowPullRequest>;
    /**
     * Function to fetch
     * the commit the workflow branch points at, or `undefined` if the branch is gone. Two editors
     * working on the same entry share its branch, so a save compares this with the head it last
     * committed to find out whether someone else has written to it meanwhile.
     */
    fetchBranchHead: (branch: string) => Promise<string | undefined>;
    /**
     * Function to read the pull request afresh right before it’s merged: where it goes, the commit its
     * branch points at, and every file it changes as of that commit. Publishing checks this against
     * what the CMS has shown for the entry, so a change it hasn’t shown can’t be merged along with it.
     */
    fetchMergeState: (pullRequest: WorkflowPullRequest) => Promise<WorkflowMergeState>;
    /**
     * Function to find which of the given files are the same at the given commit as on the configured
     * branch, missing from both counting as the same. A merge leaves such a file as it is, so it can’t
     * publish anything; an answer the service can’t vouch for leaves the file out.
     */
    fetchUnchangedPaths: (args: {
        headSHA: string;
        paths: string[];
    }) => Promise<string[]>;
    /**
     * Function to merge the
     * pull request and delete the workflow branch. The merge is pinned to the pull request’s
     * `headSHA`, so it fails if the branch has moved on since. The service may leave the merge to the
     * Git service when a required check is still running, in which case it resolves once the merge has
     * landed, and rejects if it won’t — the check has failed, say — so the entry isn’t taken for
     * published.
     */
    publish: (pullRequest: WorkflowPullRequest) => Promise<void>;
    /**
     * Function to close the
     * pull request and delete the workflow branch.
     */
    discard: (pullRequest: WorkflowPullRequest) => Promise<void>;
};
/**
 * A single commit associated with one or more files.
 */
export type FileCommit = {
    /**
     * Commit SHA hash.
     */
    sha: string;
    /**
     * Author’s display name.
     */
    authorName: string;
    /**
     * Author’s email address.
     */
    authorEmail?: string | undefined;
    /**
     * Author’s avatar URL.
     */
    authorAvatarURL?: string | undefined;
    /**
     * Author’s username on the backend service.
     */
    authorLogin?: string | undefined;
    /**
     * Commit date.
     */
    date: Date;
};
/**
 * Asset kind filter.
 */
export type MediaLibraryAssetKind = "image";
/**
 * Media library fetch options.
 */
export type MediaLibraryFetchOptions = {
    /**
     * Asset kind filter.
     */
    kind?: "image" | undefined;
    /**
     * File/Image field configuration.
     */
    fieldConfig?: MediaField | undefined;
    /**
     * API authentication key.
     */
    apiKey: string;
    /**
     * User name for services that require user authentication, such as
     * cloud storage services.
     */
    userName?: string | undefined;
    /**
     * Password for services that require user authentication, such as
     * cloud storage services.
     */
    password?: string | undefined;
    /**
     * Directory the uploaded files go to, relative to the configured
     * prefix, e.g. `2024/summer`. An empty string or `undefined` for the prefix itself. Only a cloud
     * storage service that stores files at paths reads it.
     */
    dirPath?: string | undefined;
};
/**
 * Resolved S3 configuration passed to core request helpers. Extends the public `S3MediaLibrary`
 * with internal fields that the service sets: `acl` is the canned ACL sent in the `x-amz-acl`
 * header when creating an object, if the service needs one to make it publicly readable.
 */
export type S3Config = S3MediaLibrary & {
    acl?: string;
};
/**
 * External media library service, such as a stock asset provider or a cloud storage service.
 */
export type MediaLibraryService = {
    /**
     * Service type.
     */
    serviceType: "stock_assets" | "cloud_storage";
    /**
     * Service ID.
     */
    serviceId: string;
    /**
     * Service label.
     */
    serviceLabel: string;
    /**
     * Service URL.
     */
    serviceURL: string;
    /**
     * Whether to show a link to the service in the media library.
     */
    showServiceLink: boolean;
    /**
     * Whether to hotlink files.
     */
    hotlinking: boolean;
    /**
     * Authentication type. `api_key`
     * means the service requires an API key (or API secret, depending on the service) for user
     * authentication. `none` means the service requires no authentication. `password` means the service
     * requires username/password for authentication. `widget` means the service provides its own widget
     * for file selection, and authentication is handled by the widget.
     */
    authType: "api_key" | "none" | "password" | "widget";
    /**
     * URL of the page that provides the API/developer service.
     */
    developerURL?: string | undefined;
    /**
     * URL of the page that provides an API key.
     */
    apiKeyURL?: string | undefined;
    /**
     * API key pattern.
     */
    apiKeyPattern?: RegExp | undefined;
    /**
     * Whether the service is enabled.
     * It’s determined by whether the service is defined in the CMS or field configuration.
     */
    isEnabled?: ((fieldConfig?: MediaField) => boolean) | undefined;
    /**
     * Whether the given URL points to a file on the
     * service, given the site configuration, so that such a file can be told apart from one linked from
     * elsewhere.
     */
    isAssetURL?: ((url: string) => boolean) | undefined;
    /**
     * Function to initialize the service.
     */
    init?: (() => Promise<boolean>) | undefined;
    /**
     * Function to sign in
     * to the service.
     */
    signIn?: ((userName: string, password: string) => Promise<boolean>) | undefined;
    /**
     * Function to search files.
     */
    search?: ((query: string, options: MediaLibraryFetchOptions) => Promise<ExternalAsset[]>) | undefined;
    /**
     * Function to
     * list files. For stock asset services, it should return popular or curated images.
     */
    list?: ((options: MediaLibraryFetchOptions) => Promise<ExternalAsset[]>) | undefined;
    /**
     * Function to upload files to the cloud storage service.
     */
    upload?: ((files: File[], options: MediaLibraryFetchOptions) => Promise<ExternalAsset[]>) | undefined;
    /**
     * Function to delete files from the cloud storage service.
     */
    delete?: ((assets: ExternalAsset[], options: MediaLibraryFetchOptions) => Promise<void>) | undefined;
    /**
     * Function to rename a file on the cloud storage service. Omitted
     * when the service’s API can’t rename a file.
     */
    rename?: ((asset: ExternalAsset, newName: string, options: MediaLibraryFetchOptions) => Promise<ExternalAsset>) | undefined;
    /**
     * Function to replace a file on the cloud storage service with a
     * new file, keeping the file name and URL. Omitted when the service assigns a new URL to every
     * uploaded file.
     */
    replace?: ((asset: ExternalAsset, file: File, options: MediaLibraryFetchOptions) => Promise<ExternalAsset>) | undefined;
    /**
     * Function to list the files on a cloud storage service that stores them at paths, along with the
     * empty folders it keeps. The Asset Library and the asset picker then browse the service folder by
     * folder, reading the folders off the file paths in `description`. Omitted when the service has no
     * folders, like Uploadcare, or handles them in its own widget, like Cloudinary.
     */
    browse?: ((options: MediaLibraryFetchOptions) => Promise<ExternalFolderListing>) | undefined;
    /**
     * Function to create an empty folder on the service, which keeps a placeholder
     * object for it, as object storage has no folders of its own. The path is relative to the
     * configured prefix.
     */
    createFolder?: ((dirPath: string, options: MediaLibraryFetchOptions) => Promise<void>) | undefined;
    /**
     * Function to remove the placeholder object of a folder once the files in it have
     * been deleted or moved. A folder without a placeholder is as good as removed.
     */
    deleteFolder?: ((dirPath: string, options: MediaLibraryFetchOptions) => Promise<void>) | undefined;
    /**
     * Function to move a file to another path on the service, relative
     * to the configured prefix, which is how a folder is renamed. Omitted when the service can’t move
     * a file.
     */
    move?: ((asset: ExternalAsset, newPath: string, options: MediaLibraryFetchOptions) => Promise<ExternalAsset>) | undefined;
};
/**
 * Files and folders on a cloud storage service that stores files at paths.
 */
export type ExternalFolderListing = {
    /**
     * Files.
     */
    assets: ExternalAsset[];
    /**
     * Paths of the folders kept by a placeholder object, relative to the
     * configured prefix, e.g. `2024/summer`. The folders that hold files are read off the file paths
     * instead.
     */
    folders: string[];
};
/**
 * Options for direct AI text completion requests.
 */
export type AiCompletionOptions = {
    /**
     * API authentication key.
     */
    apiKey: string;
    /**
     * Model name.
     */
    model: string;
    /**
     * System/instruction prompt.
     */
    systemPrompt: string;
    /**
     * User message content.
     */
    userMessage: string;
    /**
     * Sampling temperature (0–1). Default is 0.3. The OpenAI and
     * Anthropic APIs don’t get this parameter, as GPT-6 and Claude Haiku 5.5 reject it.
     */
    temperature?: number | undefined;
    /**
     * Maximum output tokens. Default is 4000.
     */
    maxTokens?: number | undefined;
    /**
     * Reasoning effort. Only supported by certain providers (e.g., DeepSeek, Mistral AI). Default
     * varies by provider. Anthropic Claude only supports `none`, which disables thinking.
     */
    reasoning?: "max" | "none" | "high" | "low" | "medium" | "minimal" | "xhigh" | undefined;
};
/**
 * Translation language pair.
 */
export type LanguagePair = {
    /**
     * Source language.
     */
    sourceLanguage: string;
    /**
     * Target language.
     */
    targetLanguage: string;
};
/**
 * Translate function options.
 */
export type TranslationOptions = {
    /**
     * Source language.
     */
    sourceLanguage: string;
    /**
     * Target language.
     */
    targetLanguage: string;
    /**
     * API authentication key.
     */
    apiKey: string;
};
/**
 * Translation service.
 */
export type TranslationService = {
    /**
     * Service ID.
     */
    serviceId: string;
    /**
     * Service label.
     */
    serviceLabel: string;
    /**
     * API label.
     */
    apiLabel: string;
    /**
     * URL of the page that provides the API/developer service.
     */
    developerURL: string;
    /**
     * URL of the page that provides an API key.
     */
    apiKeyURL: string;
    /**
     * API key pattern.
     */
    apiKeyPattern: RegExp;
    /**
     * Whether the service supports markdown content.
     */
    markdownSupported: boolean;
    /**
     * Function to check whether
     * the given source and target languages are supported.
     */
    availability: (options: LanguagePair) => Promise<boolean>;
    /**
     * Function to translate strings.
     */
    translate: (texts: string[], options: TranslationOptions) => Promise<string[]>;
};
/**
 * Git commit author.
 */
export type CommitAuthor = {
    /**
     * Displayed name.
     */
    name: string;
    /**
     * Email.
     */
    email: string;
    /**
     * User account ID for the Git backend.
     */
    id?: number | undefined;
    /**
     * User account name for the Git backend.
     */
    login?: string | undefined;
};
/**
 * Git commit type.
 */
export type CommitType = "create" | "update" | "delete" | "uploadMedia" | "deleteMedia";
/**
 * Basic file type.
 */
export type AssetKind = "image" | "audio" | "video" | "document" | "other";
/**
 * Metadata of a file retrieved from a Git repository.
 */
export type RepositoryFileMetadata = {
    /**
     * Git committer info for a Git backend.
     */
    commitAuthor?: CommitAuthor | undefined;
    /**
     * Commit date for a Git backend.
     */
    commitDate?: Date | undefined;
};
/**
 * Base file info retrieved from a Git repository.
 */
export type RepositoryFileInfo = {
    /**
     * Git object ID (SHA-1 hash) for the file.
     */
    sha: string;
    /**
     * File size in bytes.
     */
    size: number;
    /**
     * Raw text for a plaintext file, like HTML or Markdown.
     */
    text?: string | undefined;
    /**
     * Metadata from the repository. Missing while it’s still
     * being fetched separately from the text, or if that fetch failed; such a file counts as not fully
     * fetched yet.
     */
    meta?: RepositoryFileMetadata | undefined;
};
/**
 * Canonical metadata of entry/asset files as well as text file contents retrieved from a Git
 * repository, keyed with a file path.
 */
export type RepositoryContentsMap = Record<string, RepositoryFileInfo>;
/**
 * Entry file configuration.
 */
export type FileConfig = {
    /**
     * File extension.
     */
    extension: FileExtension;
    /**
     * File format.
     */
    format: FileFormat;
    /**
     * Normalized `folder` collection option, relative to the project root
     * folder. Entry collection only.
     */
    basePath?: string | undefined;
    /**
     * Normalized `path` collection option, relative to `basePath`. Entry
     * collection only.
     */
    subPath?: string | undefined;
    /**
     * Regular expression that matches full entry paths, taking the
     * i18n structure into account. Entry collection only.
     */
    fullPathRegEx?: RegExp | undefined;
    /**
     * File path of the default locale. File/singleton collection, or
     * entry collection storing all the entries in one file.
     */
    fullPath?: string | undefined;
    /**
     * Whether the entry collection stores all the entries in one file,
     * defined with the `file` option, as an array of objects.
     */
    arrayFile?: boolean | undefined;
    /**
     * Front matter delimiters.
     */
    fmDelimiters?: [string, string] | undefined;
    /**
     * Body field options for front matter formats.
     */
    bodyField?: BodyFieldOptions | undefined;
    /**
     * YAML quote configuration. DEPRECATED in favor of the global YAML
     * format options.
     */
    yamlQuote?: boolean | undefined;
    /**
     * Configuration for the collection’s special index file, when
     * it has an `extension` or `format` of its own. It shares everything else with the entries,
     * including `fullPathRegEx`, which matches both. Entry collection only.
     */
    indexFile?: FileConfig | undefined;
};
/**
 * File info being processed as {@link Entry} or {@link Asset}.
 */
export type BaseFileListItemProps = {
    /**
     * File handle. Local backend only.
     */
    handle?: FileSystemFileHandle | undefined;
    /**
     * File path.
     */
    path: string;
    /**
     * File name, without a path.
     */
    name: string;
    /**
     * Git object ID (SHA-1 hash) for the file.
     */
    sha: string;
    /**
     * File size in bytes.
     */
    size: number;
    /**
     * Raw text for a plaintext file, like HTML or Markdown.
     */
    text?: string | undefined;
    /**
     * Metadata from the repository. Git backends only.
     */
    meta?: RepositoryFileMetadata | undefined;
};
/**
 * Collection-level or file-level entry folder information.
 */
export type EntryFolderInfo = {
    /**
     * Collection name.
     */
    collectionName: string;
    /**
     * Collection file name. File/singleton collection only.
     */
    fileName?: string | undefined;
    /**
     * File path map. The key is a locale,
     * and the value is the corresponding file path. File/singleton collection, or entry collection
     * storing all the entries in one file.
     */
    filePathMap?: Record<string, string> | undefined;
    /**
     * Folder path. Entry collection only.
     */
    folderPath?: string | undefined;
    /**
     * Folder path map. Entry collection
     * only. Paths in `folderPathMap` are prefixed with a locale if the `multiple_root_folders` i18n
     * structure is used, or have the `{{locale}}` placeholder filled in if the collection `folder`
     * option has one, while `folderPath` is a bare collection `folder` path.
     */
    folderPathMap?: Record<string, string> | undefined;
};
/**
 * Custom entry preview renderer registered with the `CMS.registerCustomPreviewRenderer` API. This
 * is an Effet Monstre fork addition; see `docs/fork.md`. The factory receives the container element
 * and returns a function that receives the entry values and resolves to an HTML string, which is
 * shown in an iframe in the preview pane.
 */
export type CustomPreviewRenderer = (element: HTMLElement | undefined) => CustomPreviewRenderFunction;
/**
 * Function returned by a {@link CustomPreviewRenderer} factory, which turns the entry values of one
 * locale into the HTML shown in the preview pane.
 */
export type CustomPreviewRenderFunction = (args: {
    value: Record<string, any>;
    locale: InternalLocaleCode;
}) => Promise<string> | string;
/**
 * Global, collection-level, file-level or field-level asset folder information.
 */
export type AssetFolderInfo = {
    /**
     * Collection name or `undefined` for the All Assets
     * and Global Assets folders as well as field-level asset folders in custom editor components.
     */
    collectionName: string | undefined;
    /**
     * Collection file name. File/singleton collection only.
     */
    fileName?: string | undefined;
    /**
     * Field key path for a field-level asset folder.
     */
    typedKeyPath?: string | undefined;
    /**
     * Whether the asset folder is for the special index file used
     * specifically in Hugo. It works only for field-level asset folders in an entry collection.
     */
    isIndexFile?: boolean | undefined;
    /**
     * Names of the locale folders that can precede
     * `internalPath`, for an entry-relative folder in a site using the `multiple_root_folders` i18n
     * structure, or stand in for the `{{locale}}` placeholder in `internalPath`, for an entry-relative
     * folder of a collection whose `folder` option has one. Unset when the site has no i18n
     * configuration.
     */
    localeFolderNames?: string[] | undefined;
    /**
     * Custom editor component name for a field-level asset folder,
     * registered with `CMS.registerEditorComponent()`.
     */
    componentName?: string | undefined;
    /**
     * Folder path on the repository/filesystem, relative to
     * the project root directory. It can be a partial path if the collection’s `media_folder` property
     * is a relative path, because the complete path is entry-specific in that case; it’s then the
     * collection `folder` path, which may include the `{{locale}}` placeholder. It will be `undefined`
     * for the All Assets folder.
     */
    internalPath: string | undefined;
    /**
     * Subfolder below the `internalPath`, relative to
     * the entry folder. It will be set when `entryRelative` is `true`.
     */
    internalSubPath?: string | undefined;
    /**
     * Absolute folder path that will appear in the public
     * URL, starting with `/`. It can be empty if the collection’s `public_folder` property is a
     * relative path, because the complete path cannot be easily determined. It will be `undefined` for
     * the All Assets folder.
     */
    publicPath: string | undefined;
    /**
     * Whether the `internalPath` is a relative path from the asset’s
     * associated entry.
     */
    entryRelative: boolean;
    /**
     * Whether the `internalPath` contains template tags like
     * `/assets/images/{{slug}}`, which require special handling like `entryRelative`.
     */
    hasTemplateTags: boolean;
    /**
     * Label for the asset folder. Asset collections only.
     */
    label?: string | undefined;
    /**
     * Icon for the asset folder. Asset collections only.
     */
    icon?: string | undefined;
    /**
     * Whether the folder is read-only, because the collection or
     * collection file it belongs to is, or the whole CMS is. Assets can’t be uploaded to, changed or
     * deleted from the folder then. Only set when `true`.
     */
    readonly?: boolean | undefined;
    /**
     * Whether the asset folder is for an asset collection.
     */
    isAssetCollection?: boolean | undefined;
};
/**
 * File info being processed as {@link Entry}.
 */
export type BaseEntryListItem = BaseFileListItemProps & {
    type: "entry";
    folder: EntryFolderInfo;
};
/**
 * File info being processed as {@link Asset}.
 */
export type BaseAssetListItem = BaseFileListItemProps & {
    type: "asset";
    folder: AssetFolderInfo;
};
/**
 * File info for Git configuration files, such as `.gitattributes`, `.gitkeep`, etc.
 */
export type BaseConfigListItem = BaseFileListItemProps & {
    type: "config";
};
/**
 * File list item that can be an entry, asset or config file.
 */
export type BaseFileListItem = BaseEntryListItem | BaseAssetListItem | BaseConfigListItem;
export type BaseFileList = {
    /**
     * Entry file list.
     */
    entryFiles: BaseEntryListItem[];
    /**
     * Asset file list.
     */
    assetFiles: BaseAssetListItem[];
    /**
     * Config file list.
     */
    configFiles: BaseConfigListItem[];
    /**
     * All the file list combined.
     */
    allFiles: BaseFileListItem[];
    /**
     * Number of `allFiles`.
     */
    count: number;
};
export type I18nFileStructureMap = {
    /**
     * Whether the i18n structure is a single file.
     */
    i18nSingleFile: boolean;
    /**
     * Whether the i18n structure is a single file with
     * the default locale content at the root level instead of under a locale key.
     */
    i18nSingleFileDefaultRoot: boolean;
    /**
     * Whether the i18n structure is multiple files.
     */
    i18nMultiFile: boolean;
    /**
     * Whether the i18n structure is multiple folders.
     */
    i18nMultiFolder: boolean;
    /**
     * Whether the i18n structure is multiple folders with the
     * locale under the repository root.
     */
    i18nMultiRootFolder: boolean;
};
/**
 * Internal i18n configuration of a collection or collection file.
 */
export type InternalI18nOptions = {
    /**
     * Whether i18n is enabled for the collection or collection file.
     */
    i18nEnabled: boolean;
    /**
     * Whether to save the entries in all the locales. If `false`,
     * editors will be able to disable the output of non-default locales through the UI.
     */
    saveAllLocales?: boolean | undefined;
    /**
     * List of all available locales, or `['_default']` if
     * i18n is not enabled.
     */
    allLocales: InternalLocaleCode[];
    /**
     * Locales to be enabled when creating a new entry
     * draft.
     */
    initialLocales: InternalLocaleCode[];
    /**
     * Default locale, or `_default` if i18n is not
     * enabled.
     */
    defaultLocale: InternalLocaleCode;
    /**
     * File structure.
     */
    structure: I18nFileStructure;
    /**
     * I18n structure map.
     */
    structureMap: I18nFileStructureMap;
    /**
     * See `canonical_slug` above.
     */
    canonicalSlug: {
        key: string;
        value: string;
    };
    /**
     * Whether to exclude the default locale from
     * entry file paths.
     */
    omitDefaultLocaleFromFilePath: boolean;
    /**
     * Whether to exclude the default locale from
     * preview URL paths.
     */
    omitDefaultLocaleFromPreviewPath: boolean;
};
/**
 * Collection type. A folder collection in Netlify/Decap CMS is called an entry collection in
 * Sveltia CMS. We also support a special singleton collection type that is used for single files
 * not associated with any collection, such as a CMS configuration file.
 */
export type CollectionType = "entry" | "file" | "singleton";
/**
 * Extra properties for a collection.
 */
export type CollectionExtraProps = {
    /**
     * Internal i18n configuration combined with the top-level
     * configuration.
     */
    _i18n: InternalI18nOptions;
};
/**
 * Extra properties for an entry collection.
 */
export type EntryCollectionExtraProps = {
    /**
     * Collection type.
     */
    _type: Extract<CollectionType, "entry">;
    /**
     * Entry file configuration.
     */
    _file: FileConfig;
    /**
     * A list of field key paths, or file path templates
     * starting with a slash, to be used to find an entry thumbnail. See {@link Collection.thumbnail}for details.
     */
    _thumbnailFieldNames: FieldKeyPath[];
};
/**
 * Normalized entry slug options of an entry collection, whether the `slug` option is a template
 * string or an object.
 */
export type InternalSlugOptions = {
    /**
     * Slug template to fill for a new entry. It’s the configured template,
     * the legacy `{{fields._slug}}` tag when the slug is only given with the slug editor, or the
     * identifier field tag by default.
     */
    template: string;
    /**
     * Whether the template takes the slug from the slug editor, in
     * which case the slug editor must be filled in. Otherwise, a filled-in slug editor takes over from
     * the template.
     */
    editorRequired: boolean;
    /**
     * Whether the slug editor’s value is the whole slug. It’s
     * only a part of it with a legacy template that puts the value among other tags, e.g.
     * `{{year}}-{{fields._slug}}`.
     */
    editorValueIsSlug: boolean;
    /**
     * Whether the slug can be edited when an
     * entry is created, and once it has been saved.
     */
    editable: {
        create: boolean;
        update: boolean;
    };
    /**
     * Whether each locale has a slug editor of its own, and every field
     * tag in the template is filled with the locale’s own value.
     */
    localized: boolean;
    /**
     * Short description shown with the slug editor.
     */
    hint?: string | undefined;
    /**
     * Validation format of the slug.
     */
    pattern?: [string | RegExp, string] | undefined;
};
/**
 * An entry collection definition.
 */
export type InternalEntryCollection = EntryCollection & EntryCollectionExtraProps & CollectionExtraProps;
/**
 * Extra properties for a file/singleton collection.
 */
export type FileCollectionExtraProps = {
    /**
     * Collection type.
     */
    _type: Extract<CollectionType, "file" | "singleton">;
    /**
     * File map with normalized collection
     * file definitions. The key is a file identifier.
     */
    _fileMap: Record<string, InternalCollectionFile>;
};
/**
 * A file/singleton collection definition.
 */
export type InternalFileCollection = FileCollection & FileCollectionExtraProps & CollectionExtraProps;
/**
 * A singleton collection definition.
 */
export type InternalSingletonCollection = {
    /**
     * Collection name.
     */
    name: "_singletons";
    /**
     * Collection label.
     */
    label: string;
    /**
     * Singular collection label.
     */
    label_singular?: string | undefined;
    /**
     * Collection files. Can include dividers.
     */
    files: (CollectionFile | CollectionDivider)[];
};
/**
 * A collection definition.
 */
export type InternalCollection = InternalEntryCollection | InternalFileCollection;
/**
 * Extra properties for a collection file.
 */
export type ExtraCollectionFileProps = {
    /**
     * Entry file configuration.
     */
    _file: FileConfig;
    /**
     * Internal i18n configuration combined with the top-level and
     * collection-level configuration.
     */
    _i18n: InternalI18nOptions;
};
/**
 * A collection file definition.
 */
export type InternalCollectionFile = CollectionFile & ExtraCollectionFileProps;
/**
 * Each locale’s content and metadata.
 */
export type LocalizedEntry = {
    /**
     * Localized entry slug.
     */
    slug: string;
    /**
     * File path.
     */
    path: string;
    /**
     * Parsed, localized, flattened entry content.
     */
    content: FlattenedEntryContent;
};
/**
 * Localized entry map keyed with a locale code. When i18n is not enabled with the site config,
 * there will be one single property named `_default`.
 */
export type LocalizedEntryMap = Record<InternalLocaleCode, LocalizedEntry>;
/**
 * Entry properties.
 */
export type EntryProps = {
    /**
     * Unique entry ID mainly used on the cross-collection search page, where the
     * `sha`, `slug` or `fileName` property may duplicate.
     */
    id: string;
    /**
     * The slug of the default locale.
     */
    slug: string;
    /**
     * File name for a file/singleton collection, or file path without an
     * extension for an entry collection. Same as `slug` in most cases.
     */
    subPath: string;
    /**
     * Localized entry map.
     */
    locales: LocalizedEntryMap;
    /**
     * Position of the entry in the array stored in the file, for an
     * entry collection storing all the entries in one file. The `slug` and `subPath` are the same
     * number as a string.
     */
    arrayIndex?: number | undefined;
};
/**
 * Entry item.
 */
export type Entry = EntryProps & RepositoryFileMetadata;
/**
 * Search result for an entry.
 */
export type EntrySearchResult = {
    /**
     * Entry that matched the search terms.
     */
    entry: Entry;
    /**
     * Points scored for the entry based on matches.
     */
    points: number;
    /**
     * First matching locale, if available.
     */
    locale?: string | undefined;
    /**
     * First matching key path, if available.
     */
    keyPath?: string | undefined;
};
/**
 * Entry backlink information.
 */
export type EntryBacklink = {
    /**
     * Source collection name.
     */
    collectionName: string;
    /**
     * Source collection label.
     */
    collectionLabel: string;
    /**
     * Relation field label.
     */
    fieldLabel: string;
    /**
     * Source entry referencing the target.
     */
    entry: Entry;
    /**
     * Display summary for the source entry.
     */
    summary: string;
};
/**
 * - where key is a key path and value is
 * the corresponding field value.
 */
export type FlattenedEntryContent = Record<FieldKeyPath, any>;
/**
 * File to be uploaded and its target asset folder information.
 */
export type EntryFileItem = {
    /**
     * File to be uploaded.
     */
    file: File;
    /**
     * Target asset folder information.
     */
    folder: AssetFolderInfo | undefined;
    /**
     * Path of the subfolder below the target folder that the file is
     * saved to, relative to it, when the file was picked while browsing a subfolder in the asset
     * picker. Empty or `undefined` for the folder root.
     */
    subfolderPath?: string | undefined;
    /**
     * Whether to replace the existing file if there’s a file with the same
     * name in the target folder.
     */
    replace: boolean;
    /**
     * Template to name the file with when the entry is
     * saved, if the `filename_template` media library option is set. It’s removed once the file is
     * renamed by hand, and not set for a file replacing an existing one, which keeps its name.
     */
    nameTemplate?: AssetNameTemplate | undefined;
};
/**
 * Template to name an uploaded file with, along with the values that must stay the same from the
 * name shown while editing to the one saved.
 */
export type AssetNameTemplate = {
    /**
     * The `filename_template` media library option.
     */
    template: string;
    /**
     * Whether the filled name is slugified, according to the
     * `slugify_filename` media library option.
     */
    slugificationEnabled?: boolean | undefined;
    /**
     * Random values generated for the tags so far, such
     * as the one for a `{{uuid}}` tag.
     */
    randomValues: Map<string, string>;
    /**
     * Date/time parts of the time the file was added.
     */
    dateTimeParts: Record<string, string>;
};
/**
 * Flattened entry file list object, where key is a blob URL, and value is be a file to be uploaded
 * and its target asset folder.
 */
export type EntryFileMap = Record<string, EntryFileItem>;
/**
 * Validation state of a field value. The key is a validation property name, and the value is a
 * boolean. These are the same properties as the native HTML5 constraint validation, plus custom
 * widget validation support.
 */
export type EntryValidityState = Record<string, boolean> & {
    customErrorMessage?: string;
};
/**
 * Flattened entry validity state object, where key is a key path, but value will be the value’s
 * validity.
 */
export type FlattenedEntryValidityStateMap = Record<FieldKeyPath, EntryValidityState>;
/**
 * Flattened entry expander state object, where key is a key path, but value will be the field’s
 * expander UI state.
 */
export type FlattenedEntryExpanderStateMap = Record<FieldKeyPath, boolean>;
/**
 * Key is a locale code, value is whether to enable/disable the locale’s content output.
 */
export type LocaleStateMap = Record<InternalLocaleCode, boolean>;
/**
 * Locale slug map.
 */
export type LocaleSlugMap = Record<InternalLocaleCode, string | undefined>;
/**
 * Locale content map.
 */
export type LocaleContentMap = Record<InternalLocaleCode, FlattenedEntryContent>;
/**
 * Flattened validation messages map, where key is a key path and value is the list of translated
 * error message strings for that field.
 */
export type FlattenedValidationMessagesMap = Record<FieldKeyPath, string[]>;
/**
 * Locale validation messages map.
 */
export type LocaleValidationMessagesMap = Record<InternalLocaleCode, FlattenedValidationMessagesMap>;
/**
 * Locale validity map.
 */
export type LocaleValidityMap = Record<InternalLocaleCode, FlattenedEntryValidityStateMap>;
/**
 * Locale expander map.
 */
export type LocaleExpanderMap = Record<InternalLocaleCode, FlattenedEntryExpanderStateMap>;
/**
 * Entry draft.
 */
export type EntryDraft = {
    /**
     * Unique draft ID. For a new entry, it’s a randomly-generated UUID. For an
     * existing entry, it’s the same as the corresponding {@link Entry} ID.
     */
    id: string;
    /**
     * Timestamp of the draft creation.
     */
    createdAt: number;
    /**
     * `true` if it’s a new entry draft in an entry collection.
     */
    isNew: boolean;
    /**
     * Whether the corresponding entry is the collection’s special index
     * file used specifically in Hugo.
     */
    isIndexFile: boolean;
    /**
     * Whether the entry draft can show the preview pane.
     */
    canPreview: boolean;
    /**
     * Collection name, or `_singletons` for a singleton file.
     */
    collectionName: string;
    /**
     * Collection details, or pseudo-collection for a
     * singleton file.
     */
    collection: InternalCollection;
    /**
     * Collection file name. File/singleton collection only.
     */
    fileName?: string | undefined;
    /**
     * File details. File/singleton collection only.
     */
    collectionFile?: InternalCollectionFile | undefined;
    /**
     * Field definition for the collection or collection file. If index file
     * inclusion is enabled and the draft is the index file, it will be the index file’s fields.
     */
    fields: Field[];
    /**
     * Original entry or `undefined` if it’s a new entry draft.
     */
    originalEntry?: Entry | undefined;
    /**
     * Default locale code.
     */
    defaultLocale: InternalLocaleCode;
    /**
     * Original locale state at the time of draft creation.
     */
    originalLocales: LocaleStateMap;
    /**
     * Current locale state.
     */
    currentLocales: LocaleStateMap;
    /**
     * Key is a locale code, value is the original slug.
     */
    originalSlugs: LocaleSlugMap;
    /**
     * Key is a locale code, value is the current slug.
     */
    currentSlugs: LocaleSlugMap;
    /**
     * Folder the entry is stored in, relative to the collection
     * folder, at the time of draft creation. Only set when the collection’s `meta.path` option is
     * enabled. An empty string for the collection’s root folder.
     */
    originalPath?: string | undefined;
    /**
     * Folder the entry will be stored in, relative to the collection
     * folder, as edited with the path editor. Only set when the collection’s `meta.path` option is
     * enabled.
     */
    currentPath?: string | undefined;
    /**
     * Key is a locale code, value is a flattened object
     * containing all the original field values.
     */
    originalValues: LocaleContentMap;
    /**
     * Key is a locale code, value is a flattened, proxified
     * object containing all the current field values while editing.
     */
    currentValues: LocaleContentMap;
    /**
     * Key is a locale code, value is a flattened object
     * containing field values in rich text editor components.
     */
    extraValues: LocaleContentMap;
    /**
     * Files to be uploaded.
     */
    files: EntryFileMap;
    /**
     * Key is a locale code, value is a flattened object
     * containing validation results of all the current field values while editing.
     */
    validities: LocaleValidityMap;
    /**
     * Key is a locale code, value is a
     * flattened object containing the translated validation error messages for each field.
     */
    validationMessages: LocaleValidationMessagesMap;
    /**
     * Key is a locale code, value is a flattened object
     * containing the expander UI state.
     */
    expanderStates: LocaleExpanderMap;
    /**
     * Whether to show the slug editor
     * for each locale.
     */
    slugEditor: Record<LocaleCode, boolean | "readonly">;
    /**
     * Whether the user has manually interacted with the entry editor.
     * This prevents auto-backup from triggering when only programmatic changes (e.g. Lexical markdown
     * reformatting) have occurred.
     */
    interacted: boolean;
    /**
     * Entries created from a Relation field while editing
     * this entry, to be saved along with it.
     */
    pendingEntries: PendingEntry[];
};
/**
 * An entry created with the quick-add dialog of a Relation field while another entry is being
 * edited. It’s kept on that entry’s draft and saved in the same commit as the entry, rather than on
 * its own, so the two never go out of sync. Everything needed to commit it is prepared as soon as
 * it’s added, because the preparation replaces the blob URLs in the content with asset paths, which
 * can only be done once.
 */
export type PendingEntry = {
    /**
     * Name of the collection the entry belongs to.
     */
    collectionName: string;
    /**
     * Entry as it will be saved.
     */
    entry: Entry;
    /**
     * File changes to be committed along with the parent entry.
     */
    changes: FileChange[];
    /**
     * Assets to be saved along with the entry.
     */
    savingAssets: Asset[];
    /**
     * Values the Relation field that created the entry stores for it, in any
     * of the parent entry’s locales. The entry is only saved while one of them is still there.
     */
    values: any[];
};
/**
 * Entry draft backup, which is a subset of {@link EntryDraft} plus metadata.
 */
export type EntryDraftBackup = {
    /**
     * When the backup was created.
     */
    timestamp: Date;
    /**
     * The SHA-1 hash of the CMS configuration file, which is used
     * to verify that the backup can be safely restored.
     */
    cmsConfigVersion: string;
    /**
     * Collection name.
     */
    collectionName: string;
    /**
     * Entry slug. An empty string for a new entry.
     */
    slug: string;
    /**
     * Current locale state.
     */
    currentLocales: LocaleStateMap;
    /**
     * Key is a locale code, value is the current slug.
     */
    currentSlugs: LocaleSlugMap;
    /**
     * Key is a locale code, value is a flattened object
     * containing all the current field values while editing.
     */
    currentValues: LocaleContentMap;
    /**
     * Files to be uploaded.
     */
    files: EntryFileMap;
    /**
     * Entries created from a Relation field, to be saved
     * along with the entry. Missing from a backup taken before they were introduced.
     */
    pendingEntries?: PendingEntry[] | undefined;
};
/**
 * Commit action to perform. It should match GitLab’s commit action types. The `move` action can be
 * combined with a content update, not just a moving/renaming of the file.
 */
export type CommitAction = "create" | "update" | "move" | "delete";
/**
 * File entry to be created, updated or deleted.
 */
export type FileChange = {
    /**
     * Commit action.
     */
    action: CommitAction;
    /**
     * File path.
     */
    path: string;
    /**
     * Original path to a file being moved. Required when the commit
     * `action` is `move`.
     */
    previousPath?: string | undefined;
    /**
     * Git object ID (SHA-1 hash) for the original file being updated,
     * moved or deleted.
     */
    previousSha?: string | undefined;
    /**
     * Entry slug or `undefined` for an asset.
     */
    slug?: string | undefined;
    /**
     * File data. `undefined` for a deleted file, or a file object for
     * a new or updated file. It can also be a string for a text file like Markdown or HTML, which is
     * automatically converted to a Blob.
     */
    data?: string | File | undefined;
    /**
     * Item that an `update` or `delete` change applies to, in
     * a file storing all the entries of an entry collection. The `data` of an `update` or `create`
     * change is then the item alone, and a `create` change adds it to the end of the array. The changes
     * made to the same file are combined into one before being committed.
     */
    arrayItem?: ArrayItemTarget | undefined;
    /**
     * Items in a file storing all the entries of an entry
     * collection, in their new order. The items take the positions the listed items occupy now.
     */
    arrayOrder?: ArrayItemTarget[] | undefined;
};
/**
 * Item in a file storing all the entries of an entry collection, which a {@link FileChange} applies
 * to.
 */
export type ArrayItemTarget = {
    /**
     * Position of the item in the array, as the user has seen it.
     */
    index: number;
    /**
     * Content of the item as the user has seen it. The change
     * is refused if the item at the position has been changed since, e.g. by someone else, so that it
     * doesn’t overwrite another item. `undefined` to skip the check.
     */
    locales?: LocalizedEntryMap | undefined;
};
/**
 * Toast notification state for content/asset updates.
 */
export type UpdateToastState = {
    /**
     * The number of items.
     */
    count: number;
    /**
     * Whether the items have been created or updated.
     */
    saved: boolean;
    /**
     * Whether the items have been moved.
     */
    moved: boolean;
    /**
     * Whether the items have been renamed.
     */
    renamed: boolean;
    /**
     * Whether the items have been deleted.
     */
    deleted: boolean;
    /**
     * Whether a subfolder has been created in an asset folder.
     */
    folderCreated?: boolean | undefined;
    /**
     * Whether a subfolder of an asset folder has been renamed.
     */
    folderRenamed?: boolean | undefined;
    /**
     * Whether a subfolder of an asset folder has been deleted.
     */
    folderDeleted?: boolean | undefined;
    /**
     * Whether the removal awaits publication rather than having
     * taken effect, which is how Editorial Workflow deletes a published entry.
     */
    deletionPending?: boolean | undefined;
    /**
     * Whether the items’ unpublished changes have been thrown away,
     * leaving the published version on the site.
     */
    discarded?: boolean | undefined;
    /**
     * Whether a pending removal has been called off, leaving
     * the items on the site.
     */
    deletionCancelled?: boolean | undefined;
    /**
     * Whether an Open Authoring contributor’s entry turned out
     * to have been published by a maintainer when its status was changed, which closes the editor.
     */
    alreadyPublished?: boolean | undefined;
    /**
     * Whether the items have been published. This is `true` only when
     * automatic deployments are enabled and triggered.
     */
    published: boolean;
};
/**
 * Asset to be uploaded.
 */
export type UploadingAssets = {
    /**
     * Target asset folder info.
     */
    folder: AssetFolderInfo | undefined;
    /**
     * Path of the subfolder below the target folder’s
     * `internalPath` that the files are saved to, relative to it. Empty or `undefined` for the folder
     * root.
     */
    subfolderPath?: string | undefined;
    /**
     * File list.
     */
    files: File[];
    /**
     * Assets the user picked to be replaced. Each file replaces
     * the asset at the same index, taking over its name and path, so an asset can be replaced with a
     * file that’s named differently.
     */
    originalAssets?: Asset[] | undefined;
    /**
     * Whether a file that has the same name as an existing
     * asset in the target folder overwrites it. Otherwise the file is saved under a unique name.
     */
    replaceDuplicates?: boolean | undefined;
};
/**
 * Asset to be moved.
 */
export type MovingAsset = {
    /**
     * Asset.
     */
    asset: Asset;
    /**
     * New file path.
     */
    path: string;
};
/**
 * Asset properties.
 */
export type AssetProps = {
    /**
     * File object. Unsaved files only.
     */
    file?: File | undefined;
    /**
     * File handle. Local backend only.
     */
    handle?: FileSystemFileHandle | undefined;
    /**
     * Blob URL for the asset. It’s a temporary URL for a remote file being
     * fetched or a local file being uploaded. Or `undefined` if the URL is not generated yet.
     */
    blobURL?: string | undefined;
    /**
     * File name.
     */
    name: string;
    /**
     * File path.
     */
    path: string;
    /**
     * Git object ID (SHA-1 hash) for the file.
     */
    sha: string;
    /**
     * File size in bytes.
     */
    size: number;
    /**
     * Basic file type.
     */
    kind: AssetKind;
    /**
     * Raw text for a plaintext file, like HTML or Markdown.
     */
    text?: string | undefined;
    /**
     * Asset folder info.
     */
    folder: AssetFolderInfo;
    /**
     * Whether the asset is unsaved.
     */
    unsaved?: boolean | undefined;
    /**
     * Whether the asset overwrites an existing asset with the same name
     * once the entry is saved. Unsaved files only.
     */
    replace?: boolean | undefined;
    /**
     * Editorial Workflow information. It’s only set while
     * the asset lives on a workflow branch, and removed once the entry has been published.
     */
    workflow?: UnpublishedAssetProps | undefined;
};
/**
 * Editorial Workflow properties attached to an asset committed to a workflow branch. Such an asset
 * is added to the regular asset list so it can be previewed before the entry is published.
 */
export type UnpublishedAssetProps = {
    /**
     * Workflow branch the asset was committed to.
     */
    branch: string;
    /**
     * Published asset at the same path that this asset temporarily
     * shadows in the asset list. It’s restored when the draft is discarded.
     */
    replacedAsset?: Asset | undefined;
};
/**
 * Asset item.
 */
export type Asset = AssetProps & RepositoryFileMetadata;
/**
 * Item in a breadcrumb trail of folders.
 */
export type BreadcrumbItem = {
    /**
     * Folder name.
     */
    label: string;
    /**
     * Called when the folder is selected. Not needed for the current
     * folder, which is shown as text.
     */
    onClick?: (() => void) | undefined;
};
/**
 * What the folder info panel in the Asset Library describes: the listed subfolder focused with a
 * click or the keyboard, if any, or else the folder being browsed.
 */
export type AssetFolderSummary = {
    /**
     * Folder name.
     */
    name: string;
    /**
     * Folder path. Omitted for a location without a path, like the All Assets
     * folder.
     */
    path?: string | undefined;
    /**
     * Number of subfolders. Omitted for a location that isn’t browsed
     * by subfolder, which lists every asset below it at once.
     */
    folderCount?: number | undefined;
    /**
     * Number of assets.
     */
    assetCount: number;
};
/**
 * Direction to move in between the listed assets in the asset details overlay.
 */
export type AssetNavigationDirection = "previous" | "next";
/**
 * Subfolder of an asset folder, listed in the Asset Library ahead of the assets.
 */
export type AssetSubfolder = {
    /**
     * Folder name.
     */
    name: string;
    /**
     * Folder path, relative to the project root directory.
     */
    path: string;
};
/**
 * Media file dimensions.
 */
export type MediaDimensions = {
    /**
     * Media width in pixels.
     */
    width: number;
    /**
     * Media height in pixels.
     */
    height: number;
};
/**
 * GPS coordinates.
 */
export type GeoCoordinates = {
    /**
     * Latitude in degrees.
     */
    latitude: number;
    /**
     * Longitude in degrees.
     */
    longitude: number;
};
/**
 * Asset library folder map key for standard folders.
 */
export type AssetLibraryFolderMapKey = "field" | "entry" | "file" | "collection" | "global";
/**
 * Asset library folder map value.
 */
export type AssetLibraryFolderMapValue = {
    /**
     * Asset folder info.
     */
    folder: AssetFolderInfo | undefined;
    /**
     * Whether the folder is enabled.
     */
    enabled: boolean;
};
/**
 * Information about all the default asset library folders and whether these are enabled. The map
 * includes standard folder keys ('field', 'entry', 'file', 'collection', 'global') and dynamic keys
 * for asset collections (e.g., 'assets:icons', 'assets:logos').
 */
export type AssetLibraryFolderMap = Record<string, AssetLibraryFolderMapValue>;
/**
 * Asset details.
 */
export type AssetDetails = {
    /**
     * The asset’s public URL on the live site.
     */
    publicURL?: string | undefined;
    /**
     * Web-accessible URL on the Git repository. Git and local backends
     * only.
     */
    repoBlobURL?: string | undefined;
    /**
     * Media dimensions available for an image or video file.
     */
    dimensions?: MediaDimensions | undefined;
    /**
     * Media duration available for a video or audio file, in seconds.
     */
    duration?: number | undefined;
    /**
     * Date and time when the media was created, extracted from an image
     * file’s Exif data.
     */
    createdDate?: Date | undefined;
    /**
     * GPS coordinates extracted from an image file’s Exif
     * data.
     */
    coordinates?: GeoCoordinates | undefined;
    /**
     * List of entries using the asset. `undefined` means the
     * information is not yet available.
     */
    usedEntries?: Entry[] | undefined;
};
/**
 * Asset on an external media library, such as a stock photo/video or a file on cloud storage.
 */
export type ExternalAsset = {
    /**
     * Asset ID.
     */
    id: string;
    /**
     * Asset description.
     */
    description: string;
    /**
     * Thumbnail (small image) URL.
     */
    previewURL: string;
    /**
     * Asset (large image) URL for download.
     */
    downloadURL: string;
    /**
     * File name for download.
     */
    fileName: string;
    /**
     * Last modified date.
     */
    lastModified?: Date | undefined;
    /**
     * File size in bytes.
     */
    size?: number | undefined;
    /**
     * Basic file type.
     */
    kind: AssetKind;
    /**
     * Attribution HTML string, including the photographer name/link and
     * service name/link.
     */
    credit?: string | undefined;
};
/**
 * Resource selected on `<SelectAssetsDialog>`.
 */
export type SelectedResource = {
    /**
     * One of the existing assets available in the CMS.
     */
    asset?: Asset | undefined;
    /**
     * File selected from the user’s computer, or an image file downloaded from
     * a stock asset provider.
     */
    file?: File | undefined;
    /**
     * Target asset folder info for the `file`.
     */
    folder?: AssetFolderInfo | undefined;
    /**
     * Path of the subfolder below the target folder that the `file`
     * is saved to, relative to it. Empty or `undefined` for the folder root.
     */
    subfolderPath?: string | undefined;
    /**
     * URL from direct input or a hotlinking stock asset.
     */
    url?: string | undefined;
    /**
     * Public path of a folder selected in place of a file, for a File
     * field with the `select_folder` option.
     */
    folderPath?: string | undefined;
    /**
     * Attribution HTML string for a stock asset, including the photographer
     * name/link and service name/link.
     */
    credit?: string | undefined;
    /**
     * Whether to replace an existing file.
     */
    replace?: boolean | undefined;
};
/**
 * Sorting order condition.
 */
export type SortOrder = "ascending" | "descending";
/**
 * Sort key shown in the Sort menu.
 */
export type SortKey = {
    /**
     * Key, such as a field name or a special key like `commit_date`.
     */
    key: string;
    /**
     * Localized label.
     */
    label: string;
    /**
     * Value type that determines the wording of the sort order
     * labels, e.g. “new to old” for a date. A key that is a well-known date field, or a DateTime field
     * of the collection, is treated as a date even if this is omitted.
     */
    type?: "number" | "date" | undefined;
};
/**
 * Entry/Asset sorting conditions.
 */
export type SortingConditions = {
    /**
     * Target field name.
     */
    key?: string | undefined;
    /**
     * Sort order.
     */
    order?: SortOrder | undefined;
};
/**
 * Entry/Asset filtering conditions: what an entry collection’s view filter defines, minus its name
 * and label. An asset filter only has a field and pattern.
 */
export type FilteringConditionsProps = {
    /**
     * Target field name.
     */
    field: FieldKeyPath;
    /**
     * Regular expression matching pattern or exact
     * value. Required unless a comparison operator is defined.
     */
    pattern?: string | boolean | RegExp | undefined;
};
/**
 * Entry/Asset filtering conditions.
 */
export type FilteringConditions = FilteringConditionsProps & ViewComparisonOptions;
/**
 * Entry/Asset grouping conditions: what an entry collection’s view group defines, minus its name
 * and label. An asset group only has a field and pattern.
 */
export type GroupingConditionsProps = {
    /**
     * Target field name.
     */
    field: FieldKeyPath;
    /**
     * Regular expression matching pattern or exact
     * value.
     */
    pattern?: string | boolean | RegExp | undefined;
};
/**
 * Entry/Asset grouping conditions.
 */
export type GroupingConditions = GroupingConditionsProps & ViewComparisonOptions;
/**
 * Entry/Asset list view type.
 */
export type ViewType = "grid" | "list";
/**
 * Entry list view settings.
 */
export type EntryListView = {
    /**
     * View type.
     */
    type: ViewType;
    /**
     * Sorting conditions.
     */
    sort?: SortingConditions | undefined;
    /**
     * Filtering conditions. Deprecated in favour of `filters`.
     */
    filter?: FilteringConditions | undefined;
    /**
     * One or more filtering conditions.
     */
    filters?: FilteringConditions[] | undefined;
    /**
     * Grouping conditions.
     */
    group?: GroupingConditions | null | undefined;
    /**
     * Names of the groups whose entries are
     * hidden, under each grouping condition’s key. See `getGroupingKey()`.
     */
    collapsedGroups?: Record<string, string[]> | undefined;
    /**
     * Whether to show the Media pane.
     */
    showMedia?: boolean | undefined;
};
/**
 * Entry editor’s pane settings.
 */
export type EntryEditorPane = {
    /**
     * Mode.
     */
    mode: "edit" | "preview";
    /**
     * Locale.
     */
    locale: InternalLocaleCode;
    /**
     * Percentage width of the pane in the editor layout. The sum of the
     * widths of all panes should be 100.
     */
    width?: number | undefined;
};
/**
 * Select Assets dialog view settings.
 */
export type SelectAssetsView = {
    /**
     * View type.
     */
    type?: ViewType | undefined;
};
/**
 * Entry editor view settings.
 */
export type EntryEditorView = {
    /**
     * Whether to show the second pane, which holds either the
     * preview or another locale’s editor. Called the “second” rather than the “right” pane because the
     * panes are laid out in the writing direction, which is reversed for RTL locales.
     */
    showSecondPane?: boolean | undefined;
    /**
     * Whether to show the preview pane.
     */
    showPreview?: boolean | undefined;
    /**
     * Whether to sync the scrolling position between the editor and
     * preview panes.
     */
    syncScrolling?: boolean | undefined;
    /**
     * Key is a collection
     * name (and a file name joined by `|`), value is the left and right pane states. The state can be
     * `null` if preview is disabled.
     */
    paneStates?: Record<string, [EntryEditorPane | null, EntryEditorPane | null]> | undefined;
    /**
     * View settings for the Select Assets dialog.
     */
    selectAssetsView?: SelectAssetsView | undefined;
    /**
     * Active sidebar panel key, e.g. `validation`.
     */
    sidebarPanel?: string | null | undefined;
};
/**
 * Asset list view settings.
 */
export type AssetListView = {
    /**
     * View type.
     */
    type: ViewType;
    /**
     * Sorting conditions.
     */
    sort?: SortingConditions | undefined;
    /**
     * Filtering conditions.
     */
    filter?: FilteringConditions | undefined;
    /**
     * Unused.
     */
    filters?: FilteringConditions[] | undefined;
    /**
     * Grouping conditions.
     */
    group?: GroupingConditions | null | undefined;
    /**
     * Names of the groups whose assets are
     * hidden, under each grouping condition’s key. See `getGroupingKey()`.
     */
    collapsedGroups?: Record<string, string[]> | undefined;
    /**
     * Whether to show the Info pane.
     */
    showInfo?: boolean | undefined;
};
/**
 * Custom file format definition.
 */
export type CustomFileFormat = {
    /**
     * File extension.
     */
    extension: string;
    /**
     * Parser method.
     */
    parser?: FileParser | undefined;
    /**
     * Formatter method.
     */
    formatter?: FileFormatter | undefined;
};
/**
 * Key to store the current values in the {@link EntryDraft}. Usually `currentValues`, but can be
 * `extraValues` to store extra values for a rich text editor component.
 */
export type DraftValueStoreKey = "currentValues" | "extraValues";
/**
 * Context for a field, which may change the behavior of the editor/preview.
 */
export type FieldContext = "rich-text-editor-component" | "single-subfield-list-field";
/**
 * Context for a field editor.
 */
export type FieldEditorContext = {
    /**
     * Where the field is rendered.
     */
    fieldContext?: FieldContext | undefined;
    /**
     * Names of the parent rich text editor components. If
     * nested, the first element is the top-level component, and the last element is the immediate
     * parent component. If the field is not in a rich text editor component, the array is empty.
     */
    parentComponentNames: string[];
    /**
     * Key to store the values in {@link EntryDraft}.
     */
    valueStoreKey: DraftValueStoreKey;
    /**
     * Component to render an extra hint in
     * the field editor.
     */
    extraHint?: {
        current: Component | undefined;
    } | undefined;
};
/**
 * Common properties to be passed to a field’s editor component.
 */
export type FieldEditorProps = {
    /**
     * Current pane’s locale.
     */
    locale: InternalLocaleCode;
    /**
     * Field key path.
     */
    keyPath: FieldKeyPath;
    /**
     * Typed field key path.
     */
    typedKeyPath: TypedFieldKeyPath;
    /**
     * Field ID.
     */
    fieldId: string;
    /**
     * Field label.
     */
    fieldLabel: string;
    /**
     * Whether to mark the field required.
     */
    required?: boolean | undefined;
    /**
     * Whether to mark the field read-only.
     */
    readonly?: boolean | undefined;
    /**
     * Whether to mark the field invalid.
     */
    invalid?: boolean | undefined;
};
/**
 * Common properties to be passed to a field’s preview component.
 */
export type FieldPreviewProps = {
    /**
     * Current pane’s locale.
     */
    locale: InternalLocaleCode;
    /**
     * Field key path.
     */
    keyPath: FieldKeyPath;
    /**
     * Typed field key path.
     */
    typedKeyPath: TypedFieldKeyPath;
};
export type DateTimeFieldNormalizedProps = {
    /**
     * The `type` HTML attribute value.
     */
    type: DateTimeInputType;
    /**
     * The `min` HTML attribute value.
     */
    min: string | undefined;
    /**
     * The `max` HTML attribute value.
     */
    max: string | undefined;
    /**
     * The `step` HTML attribute value.
     */
    step: number | "any" | undefined;
    /**
     * Same as {@link DateTimeFieldProps.format}. If it’s missing,
     * {@link DateTimeFieldProps.date_format} and {@link DateTimeFieldProps.time_format} will be used
     * instead. If these options are also missing, the value will be `undefined`, which makes the output
     * standard ISO 8601 format.
     */
    format: string | undefined;
    /**
     * Whether the field is date only.
     */
    dateOnly: boolean;
    /**
     * Whether the field is time only.
     */
    timeOnly: boolean;
    /**
     * Whether the field’s picker is UTC.
     */
    utc: boolean;
    /**
     * Timezone used by the date input.
     */
    inputTimeZone: "local" | "utc" | string;
    /**
     * Whether to convert stored values to UTC.
     */
    outputUTC: boolean;
    /**
     * The custom timezone to use for input
     * processing and display when exactly one custom timezone is configured, or undefined otherwise.
     */
    singleCustomTimeZone: string | undefined;
};
/**
 * Select/Relation field editor’s selector properties.
 */
export type SelectFieldSelectorProps = {
    /**
     * Current pane’s locale.
     */
    locale: InternalLocaleCode;
    /**
     * Field key path.
     */
    keyPath: FieldKeyPath;
    /**
     * Field ID.
     */
    fieldId: string;
    /**
     * Field configuration.
     */
    fieldConfig: SelectField;
    /**
     * Whether to mark the field required.
     */
    required?: boolean | undefined;
    /**
     * Whether to mark the field read-only.
     */
    readonly?: boolean | undefined;
    /**
     * Whether to mark the field invalid.
     */
    invalid?: boolean | undefined;
    /**
     * Selector options.
     */
    options: SelectFieldSelectorOption[];
};
/**
 * Select/Relation field editor’s selector option.
 */
export type SelectFieldSelectorOption = {
    /**
     * Option label.
     */
    label: string;
    /**
     * Option value.
     */
    value: SelectFieldValue;
    /**
     * Option value specifically for filtering.
     */
    searchValue?: string | undefined;
};
export type PopulateDefaultValueArgs = {
    /**
     * An object holding a new content key-value map.
     */
    content: FlattenedEntryContent;
    /**
     * Field key path, e.g. `author.name`.
     */
    keyPath: FieldKeyPath;
    /**
     * Field configuration.
     */
    fieldConfig: Field;
    /**
     * Locale.
     */
    locale: InternalLocaleCode;
    /**
     * Default locale of the entry draft.
     */
    defaultLocale: InternalLocaleCode;
    /**
     * Dynamic default values.
     */
    dynamicValues: Record<string, string>;
};
/**
 * Index of a flattened entry content, which tells in constant time whether a key path holds
 * anything at all and which list items exist under it.
 */
export type ContentIndex = {
    /**
     * Direct child key segments found under
     * each key path. For example, content holding only `colors.0.name` yields `colors` → `0` and
     * `colors.0` → `name`.
     */
    childSegmentMap: Map<FieldKeyPath, Set<string>>;
};
/**
 * Index of the list items in a flattened entry content: the key path holding a list mapped to the
 * indexes of the items stored under it.
 */
export type ListItemIndex = Map<FieldKeyPath, Set<number>>;
export type NormalizeContentArgs = {
    /**
     * Field list of a collection, collection file or index file.
     */
    fields: Field[];
    /**
     * Flattened entry content, modified in place.
     */
    content: FlattenedEntryContent;
    /**
     * Locale of the content.
     */
    locale: InternalLocaleCode;
    /**
     * Default locale of the entry draft.
     */
    defaultLocale: InternalLocaleCode;
    /**
     * Already normalized content for the
     * default locale, used as the source for fields with the `duplicate` i18n strategy.
     */
    defaultLocaleContent?: FlattenedEntryContent | undefined;
    /**
     * Whether to fill in the values missing from the content.
     * Default: `true`. Set to `false` to only reconcile the values that are already there, which is
     * what rich text editor components need: their values live in the document text, so filling in
     * defaults would rewrite the document just by opening the entry.
     */
    fillDefaults?: boolean | undefined;
};
export type GetDefaultValueMapFuncArgs = {
    /**
     * Field configuration.
     */
    fieldConfig: Field;
    /**
     * Field key path, e.g. `author.name`.
     */
    keyPath: FieldKeyPath;
    /**
     * Locale code.
     */
    locale: LocaleCode;
    /**
     * Default locale of the entry draft.
     */
    defaultLocale: InternalLocaleCode;
    /**
     * Dynamic default value parsed from the URL query string.
     */
    dynamicValue?: string | undefined;
    /**
     * Callback to populate a
     * default value for a sub-field, injected to avoid a circular dependency between field-type
     * defaults and the centralized `populateDefaultValue` dispatcher.
     */
    populateDefault?: ((args: PopulateDefaultValueArgs) => void) | undefined;
};
/**
 * Arguments for the validation function of a field.
 */
export type ValidateFieldFuncArgs = {
    /**
     * Field configuration.
     */
    fieldConfig: Field;
    /**
     * Current locale.
     */
    locale: InternalLocaleCode;
    /**
     * Current value.
     */
    value: any;
};
/**
 * Options for the `fillTemplate` method.
 */
export type FillTemplateOptions = {
    /**
     * Slug type.
     */
    type?: "preview_path" | "media_folder" | undefined;
    /**
     * Entry collection.
     */
    collection: InternalCollection;
    /**
     * Entry content for the default locale.
     */
    content: FlattenedEntryContent;
    /**
     * Entry slug already created for the path.
     */
    currentSlug?: string | undefined;
    /**
     * File path of the entry. Required if the `type` is
     * `preview_path` or `media_folder`.
     */
    entryFilePath?: string | undefined;
    /**
     * Locale. Required if the `type` is `preview_path`.
     */
    locale?: string | undefined;
    /**
     * Map of date/time parts. Required if the `type`
     * is `preview_path`.
     */
    dateTimeParts?: Record<string, string> | undefined;
    /**
     * Whether the corresponding entry is the collection’s special
     * index file used specifically in Hugo.
     */
    isIndexFile?: boolean | undefined;
    /**
     * Random values generated for the entry so far,
     * such as the one for a `{{uuid}}` tag, to be reused instead of generating new ones. It keeps a new
     * entry’s slug the same between the one shown while editing and the one saved.
     */
    randomValues?: Map<string, string> | undefined;
    /**
     * Original name of the asset file being named with the
     * `filename_template` media library option. The `{{filename}}` and `{{extension}}` tags then stand
     * for its name without the extension and its extension.
     */
    assetFileName?: string | undefined;
};
/**
 * Entry slug variants.
 */
export type EntrySlugVariants = {
    /**
     * Default locale’s entry slug.
     */
    defaultLocaleSlug: string;
    /**
     * Localized slug map.
     */
    localizedSlugs: LocaleSlugMap | undefined;
    /**
     * Canonical slug.
     */
    canonicalSlug: string | undefined;
};
/**
 * Supported image fit option.
 */
export type ImageFitOption = "scale-down" | "contain";
/**
 * Image transformation options used internally.
 */
export type InternalImageTransformationOptions = {
    /**
     * New image format. Default: original format.
     */
    format?: RasterImageFormat | undefined;
    /**
     * Image quality between 0 and 100. Default: 85.
     */
    quality?: number | undefined;
    /**
     * Width. Default: original width.
     */
    width?: number | undefined;
    /**
     * Height. Default: original height.
     */
    height?: number | undefined;
    /**
     * Fit option. Default: `scale-down`.
     */
    fit?: ImageFitOption | undefined;
};
/**
 * Shape of the `processedAssets` state.
 */
export type ProcessedAssets = {
    /**
     * Whether the files are being processed.
     */
    processing: boolean;
    /**
     * Files that can be uploaded.
     */
    validFiles: File[];
    /**
     * Files that cannot be uploaded due to the size limit.
     */
    oversizedFiles: File[];
    /**
     * Files that cannot be uploaded because they’re corrupt or
     * mislabeled, such as a HEIC image saved with a `.jpg` extension.
     */
    invalidFiles: File[];
    /**
     * Mapping of transformed files and the
     * originals.
     */
    transformedFileMap: WeakMap<File, File>;
};
/**
 * The file an image/file field value points to.
 */
export type MediaFieldSource = {
    /**
     * Complete URL of a file on an external location, including a Cloudinary
     * asset referenced by its relative path.
     */
    url?: string | undefined;
    /**
     * Asset in the repository. Exclusive with {@link MediaFieldSource.url}.
     */
    asset?: Asset | undefined;
};
/**
 * Arguments for the `getField` function.
 */
export type GetFieldArgs = {
    /**
     * Collection name.
     */
    collectionName: string;
    /**
     * Collection file name. File/singleton collection only.
     */
    fileName?: string | undefined;
    /**
     * Rich text editor component name.
     */
    componentName?: string | undefined;
    /**
     * Object holding current entry values. This is
     * required when working with list/object field variable types.
     */
    valueMap?: FlattenedEntryContent | undefined;
    /**
     * Field key path or typed key path.
     */
    keyPath: FieldKeyPath | TypedFieldKeyPath;
    /**
     * Whether the corresponding entry is the collection’s special
     * index file used specifically in Hugo.
     */
    isIndexFile?: boolean | undefined;
};
/**
 * Context for config parsing.
 */
export type ConfigParserContext = {
    /**
     * Raw site config to parse.
     */
    cmsConfig?: CmsConfig | undefined;
    /**
     * Collection config to parse.
     */
    collection?: Collection | InternalSingletonCollection | undefined;
    /**
     * File config to parse.
     */
    collectionFile?: CollectionFile | undefined;
    /**
     * Name of the editor component.
     */
    componentName?: string | undefined;
    /**
     * Whether the field is part of an index file.
     */
    isIndexFile?: boolean | undefined;
    /**
     * Key path to the field being parsed.
     */
    typedKeyPath?: string | undefined;
};
/**
 * Collected Media field during config parsing. It will be processed later to enable field-specific
 * asset folders.
 */
export type CollectedMediaField = {
    /**
     * File/Image field config, or the config of a
     * custom field whose control can add files to the entry draft.
     */
    fieldConfig: MediaField | CustomField;
    /**
     * Field parser context.
     */
    context: ConfigParserContext;
};
/**
 * Collected Relation field during config parsing. It will be processed later to enable reverse
 * reference lookups.
 */
export type CollectedRelationField = {
    /**
     * Relation field config.
     */
    fieldConfig: RelationField;
    /**
     * Field parser context.
     */
    context: ConfigParserContext;
};
/**
 * A Relation field that points at a given collection, resolved down to everything needed to locate
 * its stored values within the entries holding the field.
 */
export type ResolvedRelationField = {
    /**
     * Relation field config.
     */
    fieldConfig: RelationField;
    /**
     * Collection holding the Relation field.
     */
    sourceCollection: InternalCollection;
    /**
     * Collection file holding the Relation
     * field, for file/singleton collections.
     */
    sourceCollectionFile?: InternalCollectionFile | undefined;
    /**
     * Key path of the field within an entry’s flattened content. May
     * contain `*` wildcards when the field is nested in a list.
     */
    keyPath: FieldKeyPath;
    /**
     * Pattern matching the concrete key paths a wildcard `keyPath`
     * expands to. `undefined` when the key path has no wildcard.
     */
    valuePattern?: RegExp | undefined;
    /**
     * Whether the field accepts multiple values.
     */
    multiple: boolean;
};
/**
 * An entry that references another entry through a Relation field, with its references already
 * updated or removed, along with where it lives so its file(s) can be written back.
 */
export type CascadeTarget = {
    /**
     * Updated entry.
     */
    entry: Entry;
    /**
     * Collection the entry belongs to.
     */
    collection: InternalCollection;
    /**
     * Collection file, for file/singleton
     * collections.
     */
    collectionFile?: InternalCollectionFile | undefined;
};
/**
 * A Relation field that would no longer be valid once its references to the entries being deleted
 * are removed, e.g. a required field with nothing left selected, which is what stops the deletion.
 */
export type CascadeDeleteBlockerProps = {
    /**
     * Locale the field was found invalid in. A field invalid in
     * several locales is reported once, for the first of them.
     */
    locale: InternalLocaleCode;
    /**
     * Key path of the invalid field.
     */
    keyPath: FieldKeyPath;
    /**
     * Validation messages, one per violated constraint.
     */
    messages: string[];
};
export type CascadeDeleteBlocker = EntryBacklink & CascadeDeleteBlockerProps;
/**
 * A field holding a reference to an asset: an Image or File field storing its path, or a Markdown
 * or rich text field embedding it as an image.
 */
export type AssetReference = {
    /**
     * Entry holding the field.
     */
    entry: Entry;
    /**
     * Collection the field is resolved in.
     */
    collection: InternalCollection;
    /**
     * Collection file, for file/singleton
     * collections.
     */
    collectionFile?: InternalCollectionFile | undefined;
    /**
     * Locale of the content holding the field.
     */
    locale: InternalLocaleCode;
    /**
     * Key path of the value holding the reference. For a multi-value
     * field, that of the item, e.g. `images.1`.
     */
    keyPath: FieldKeyPath;
    /**
     * Field config.
     */
    fieldConfig: Field;
};
/**
 * Everything the deletion of one or more entries entails for the entries referencing them through
 * Relation fields.
 */
export type CascadeDeletePlan = {
    /**
     * Referencing entries with the references removed, to be
     * rewritten along with the deletion.
     */
    targets: CascadeTarget[];
    /**
     * Fields that would be left invalid. The deletion can
     * only go ahead if this is empty.
     */
    blockers: CascadeDeleteBlocker[];
};
/**
 * Collectors used during config parsing.
 */
export type ConfigParserCollectors = {
    /**
     * Collected error messages.
     */
    errors: Set<string>;
    /**
     * Collected warning messages.
     */
    warnings: Set<string>;
    /**
     * Collected media fields.
     */
    mediaFields: Set<CollectedMediaField>;
    /**
     * Collected relation fields.
     */
    relationFields: Set<CollectedRelationField>;
};
/**
 * A schema violation, in the shape the configuration error reporter works with. It mirrors the part
 * of Ajv’s error object the reporter used to read, so that the validator can be swapped without the
 * reporting having to change.
 */
export type SchemaValidationError = {
    /**
     * JSON pointer to the offending value within the configuration.
     */
    instancePath: string;
    /**
     * Schema keyword that was violated.
     */
    keyword: string;
    /**
     * Details of the constraint, such as the allowed values.
     */
    params: Record<string, any>;
};
/**
 * The two variants of the configuration schema the validator uses. An unknown property is only
 * worth a warning, but it fails the object holding it all the same, so the violations that are real
 * errors are collected from the variant that accepts it.
 */
export type ConfigSchemas = {
    /**
     * Schema that rejects a property it doesn’t describe, used
     * to find the options the schema doesn’t know about.
     */
    strict: Record<string, any>;
    /**
     * Same schema with every `additionalProperties: false`
     * removed, used to find everything else.
     */
    lenient: Record<string, any>;
};
/**
 * Relation field option.
 */
export type RelationOption = {
    /**
     * Option label.
     */
    label: string;
    /**
     * Option value.
     */
    value: any;
    /**
     * Searchable value.
     */
    searchValue: string;
};
/**
 * Arguments for a field parser function.
 */
export type FieldParserArgs = {
    /**
     * Field configuration.
     */
    config: Field;
    /**
     * Field parser context.
     */
    context: ConfigParserContext;
    /**
     * Collectors to collect messages and special fields.
     */
    collectors: ConfigParserCollectors;
};
export type UnsupportedOption = {
    /**
     * Message type. Default: `error`.
     */
    type?: "error" | "warning" | undefined;
    /**
     * Property name.
     */
    prop: string;
    /**
     * New property name if renamed.
     */
    newProp?: string | undefined;
    /**
     * Unsupported property value.
     */
    value?: any;
    /**
     * The i18n string key for the message. Default:
     * `unsupported_deprecated_option`.
     */
    strKey?: string | undefined;
};
export type SettingsPanelOnChangeArgs = {
    /**
     * Message to show in a toast notification after the change is applied.
     */
    message: string;
    /**
     * Status of the change. Default: `success`.
     */
    status?: "error" | "success" | undefined;
};
/**
 * Parsed transformation descriptor used by template placeholders and summary rendering.
 */
export type StringTransformation = {
    /**
     * The transformation name.
     */
    method: string;
    /**
     * Transformation arguments.
     */
    args: Record<string, string>;
};
import type { LocaleCode } from './public';
import type { CmsConfig } from './public';
import type { BackendName } from './public';
import type { GitBackendName } from './public';
import type { MediaField } from './public';
import type { S3MediaLibrary } from './public';
import type { FileExtension } from './public';
import type { FileFormat } from './public';
import type { BodyFieldOptions } from './public';
import type { I18nFileStructure } from './public';
import type { FieldKeyPath } from './public';
import type { EntryCollection } from './public';
import type { FileCollection } from './public';
import type { CollectionFile } from './public';
import type { CollectionDivider } from './public';
import type { Field } from './public';
import type { ViewComparisonOptions } from './public';
import type { FileParser } from './public';
import type { FileFormatter } from './public';
import type { Component } from 'svelte';
import type { DateTimeInputType } from './public';
import type { SelectField } from './public';
import type { SelectFieldValue } from './public';
import type { RasterImageFormat } from './public';
import type { Collection } from './public';
import type { CustomField } from './public';
import type { RelationField } from './public';
