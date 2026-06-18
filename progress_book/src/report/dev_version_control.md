# 6.3. Version Control Strategy: The "Rescue Branch" Workflow

Version control was managed with **Git on GitHub**, using feature branches that
merged into a main integration branch through pull requests.

### The "Rescue Branch" workflow
Like most real projects, the team occasionally hit situations where the main
branch became unstable — a risky merge, a broken integration, or conflicting work
that needed untangling. To handle these safely, the team adopted a **"rescue
branch"** practice:

1. When the main line was at risk or broken, a dedicated **rescue branch** was cut
   from the last known-good commit.
2. Stabilization work — conflict resolution, reverting bad merges, reconciling
   diverged work — happened on the rescue branch, isolated from ongoing feature
   development.
3. Once verified stable, the rescue branch was merged back, restoring a healthy
   main line without losing in-progress work.

### Why it mattered
This workflow gave the team a **safety net**: experimentation and recovery could
happen without freezing everyone else, and the project always had a path back to a
working state. It reflects the reality that source control is not just for storing
code, but for *recovering* from the inevitable mistakes of fast-paced development.
