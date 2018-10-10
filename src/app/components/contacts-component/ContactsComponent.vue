<template>
  <div class="contacts">
    <a href="https://jira.playtika.com/secure/CreateIssueDetails!init.jspa?pid=17500&issuetype=3&components=23736"
       target="_blank">Create issue</a>
    <a href="https://join.skype.com/krRZX6WuYiZo" target="_blank">Ask a question</a>
  </div>
</template>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";
  @import "../../../assets/styles/mixins";

  .contacts {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 999;
    height: $header-height;
    a {
      text-decoration: none;
      color: #409EFF;
      opacity: .7;
      margin-right: 20px;
      line-height: $header-height;
      &:hover {
        opacity: 1;
      }
      &:first-child {
        margin-left: 40px;
      }
    }
  }
</style>