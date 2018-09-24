<template>
  <div class="footer">
    <a href="https://jira.playtika.com/secure/CreateIssueDetails!init.jspa?pid=17500&issuetype=3&components=23736"
       target="_blank">Create issue</a>
    <a href="https://join.skype.com/krRZX6WuYiZo" target="_blank">Ask a question</a>
  </div>
</template>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";
  @import "../../../assets/styles/mixins";

  .footer {
    position: fixed;
    z-index: 99999;
    bottom: 0;
    left: 0;
    right: 0;
    height: $footer-height;
    background: #409EFF;
    a {
      text-decoration: none;
      color: #ffffff;
      opacity: .7;
      margin-right: 20px;
      line-height: $footer-height;
      &:hover {
        opacity: 1;
      }
      &:first-child {
        margin-left: 40px;
      }
    }
  }
</style>