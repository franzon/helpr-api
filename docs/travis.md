# Travis

## Workflow

1. Checkout on `master` and update with `git pull`
2. Start a branch and code your feature
    `git checkout -b awesome_feature`
3. Run tests locally with `yarn test` or `yarn test-docker`
4. When you finish coding, push your code to a remote branch
    `git push origin awesome_feature`
5. On Github, click on "Compare & pull request"
6. Assign one or more reviewers
7. Click on "Create pull request"
8. Now, Travis will run the tests on their server
9. After all tests passed, one reviewer must approve the changes
10. Click on "Merge pull request"
11. Your branch will be merged into master and deployed to Heroku

## Heroku app

https://pi-2019.herokuapp.com/