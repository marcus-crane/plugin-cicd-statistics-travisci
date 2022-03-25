# plugin-cicd-statistics-travisci
A TravisCI implementation of the CI/CD statistics plugin for Backstage

This is NOT a valid plugin, it simply demonstrates how you might go about writing a cicd-statistics provider

You should treat this repo as a diff of sorts. These files are what I altered to implement Travis CI but it should roughly apply to any CI/CD provider.

It also isn't complete. It renders builds but none of the actual filtering mechanisms are wired up

Eventually I would like to tidy it up (currently typescript checks fail) and submit it to backstage core
