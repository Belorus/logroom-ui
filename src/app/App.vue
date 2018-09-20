<template>
  <div class="main_container">
    <router-view></router-view>
  </div>
</template>

<script>
  import {mapActions} from "vuex";
  import {httpWrapper} from "./http/http-wrapper";

  export default {
    sockets:{
      connect: function(){
        console.log('socket connected');
        this.getAllActiveSessionsByHttp();
      },
      disconnect: function () {
        this.clearActiveSessions();
        console.log('socket to notification channel disconnected')
      },
      SOCKET_B_STOP_LISTEN_SESSION_SUCCESS: function () {
        console.log('Session listenning stopped');
      },
      SOCKET_B_NEW_ACTIVE_SESSION: function (sessionData) {
        this.addNewActiveSession(sessionData);
      },
      SOCKET_B_ACTIVE_SESSION_UPDATED: function (sessionData) {
        this.updateSessionData(sessionData);
      }
    },
    methods: {
      ...mapActions({
        getActiveSessionsAction: 'getActiveSessionsAction',
        clearActiveSessions: 'clearActiveSessions',
        addNewActiveSession: 'addNewActiveSession',
        updateSessionData: 'updateSessionData'
      }),
      getAllActiveSessionsByHttp() {
        httpWrapper.getActiveSessions(
          sessionsData => {
            let sessionIds = [];
            sessionsData.map(sessionDataObj => {
              let sessionObj = Object.assign({}, sessionDataObj, {id: sessionDataObj.id});
              sessionIds.push(sessionObj);
            });

            let fakeSessions = [{"id": "1",
              "additional": {
                "device_model": "Apple",
                "branch": "N/A",
                "os": "Mac Os",
                "app_name": "Bingo",
                "user_id": "1068438",
                "login_type": "Guest",
                "environment": "DEV",
                "device_name": "YudzitskiS",
                "app_version": "3.92.3",
                "os_version": "10",
                "user_name": ""
              },
              "logsCount": 3322,
              "updatedAt": 1537350186237
            },
              {"id": "2",
                "additional": {
                  "device_model": "Apple",
                  "branch": "N/A",
                  "os": "Mac Os",
                  "app_name": "Bingo",
                  "user_id": "1068438",
                  "login_type": "Guest",
                  "environment": "DEV",
                  "device_name": "YudzitskiS",
                  "app_version": "3.92.3",
                  "os_version": "10",
                  "user_name": ""
                },
                "logsCount": 3322,
                "updatedAt": 1537350186237
              },
              {"id": "3",
                "additional": {
                  "device_model": "Windows",
                  "branch": "N/A",
                  "os": "Mac Os",
                  "app_name": "Bingo",
                  "user_id": "1068438",
                  "login_type": "Guest",
                  "environment": "DEV",
                  "device_name": "YudzitskiS",
                  "app_version": "3.92.3",
                  "os_version": "10",
                  "user_name": ""
                },
                "logsCount": 3322,
                "updatedAt": 1537350186237
              },
              {"id": "4",
                "additional": {
                  "device_model": "Apple MacBookPro11,4",
                  "branch": "N/A",
                  "os": "Mac Os",
                  "app_name": "Blitz",
                  "user_id": "1068438",
                  "login_type": "Guest",
                  "environment": "DEV",
                  "device_name": "YudzitskiS",
                  "app_version": "3.92.2",
                  "os_version": "10",
                  "user_name": ""
                },
                "logsCount": 3322,
                "updatedAt": 1537350186237
              },
              {"id": "5",
                "additional": {
                  "device_model": "Apple MacBookPro11,4",
                  "branch": "N/A",
                  "os": "Mac Os",
                  "app_name": "Blitz",
                  "user_id": "1068438",
                  "login_type": "Guest",
                  "environment": "DEV",
                  "device_name": "YudzitskiS",
                  "app_version": "3.92.2",
                  "os_version": "10",
                  "user_name": ""
                },
                "logsCount": 3322,
                "updatedAt": 1537350186237
              },
              {"id": "6",
                "additional": {
                  "device_model": "MacBookPro11,4",
                  "branch": "N/A",
                  "os": "Mac Os",
                  "app_name": "Bingo Blitz",
                  "user_id": "1068438",
                  "login_type": "Guest",
                  "environment": "DEV",
                  "device_name": "YudzitskiS",
                  "app_version": "3.92.2",
                  "os_version": "10",
                  "user_name": ""
                },
                "logsCount": 3322,
                "updatedAt": 1537350186237
              },
              {"id": "7",
                "additional": {
                  "device_model": "Apple MacBookPro11,4",
                  "branch": "N/A",
                  "os": "Mac Os",
                  "app_name": "Bingo Blitz",
                  "user_id": "1068438",
                  "login_type": "Guest",
                  "environment": "DEV",
                  "device_name": "YudzitskiS",
                  "app_version": "3.92.2",
                  "os_version": "10",
                  "user_name": ""
                },
                "logsCount": 3322,
                "updatedAt": 1537350186237
              }];

            fakeSessions.map(s => {
              let sessionObj = Object.assign({}, s, {id: s.id});
              sessionIds.push(sessionObj)
            });

            this.getActiveSessionsAction(sessionIds);
          },
          err => {
            console.log(err, 'GET ACTIVE SESSIONS OVER HTTP MODULE ERROR OCCURED');
          }
        )
      }
    }
  }
</script>