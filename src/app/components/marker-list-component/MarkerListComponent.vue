<template>
  <div>
    <h4>Saved Markers</h4>
    <div class="markers_container">
      <div class="session_marker"
           :class="{selected_marker: selectedMarker === marker.id}"
           v-if="sessionMarkers.length > 0"
           v-for="marker in sessionMarkers">
        <p class="marker_name">{{markerName(marker)}}</p>
        <el-button
          plain
          type="danger"
          size="mini"
          icon="el-icon-close"
          @click="deleteMarker(marker.id)"
        ></el-button>
        <el-button
          plain
          :type="selectedMarker === marker.id ? 'success' : 'plain'"
          size="mini"
          :icon="selectedMarker === marker.id ? 'el-icon-back' : 'el-icon-d-arrow-right'"
          @click="markerSelectionHandler(marker)"
        ></el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";
  import {httpWrapper} from "Http/http-wrapper";

  export default {
    data() {
      return {
        currentSessionId: null,
        selectedMarker: null
      }
    },
    created() {
      this.currentSessionId = this.$route.params.id;
      this.selectedMarker = this.$route.query.markerId;
    },
    computed: {
      ...mapGetters({
        getSessionMarkers: 'getSessionMarkers'
      }),
      sessionMarkers() {
        return this.getSessionMarkers(this.currentSessionId);
      }
    },
    methods: {
      ...mapActions({
        resetSelectedMarker: 'resetSelectedMarker',
        removeSessionMarker: 'removeSessionMarker'
      }),
      markerName(marker) {
        return `Marker ${marker.endPosition} - ${marker.startPosition}`;
      },
      markerSelectionHandler(marker) {
        const isMarkerSelected = this.selectedMarker === marker.id;
        isMarkerSelected ? this.deselectMarker() : this.selectMarker(marker.id);
      },
      selectMarker(markerId) {
        const markerData = {
          markerId: markerId
        };
        this.selectedMarker = markerId;
        this.$router.replace({ query: markerData});
      },
      deselectMarker() {
        this.$router.replace({ query: {}});
        this.selectedMarker = null;
        this.resetSelectedMarker();
      },
      deleteMarker(markerId) {
        httpWrapper.deleteSessionMarker(this.currentSessionId, markerId, () => {
          this.deselectMarker();
          this.removeSessionMarker({sessionId: this.currentSessionId, markerId: markerId})
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/mixins";

  .markers_container {
    max-height: 200px;
    border: 1px solid #fafafa;
    overflow-x: scroll;
    @include markers-shadow;
  }
  .session_marker {
    padding: 10px 0;
    transition: background .3s;
    &:hover {
      background: #fafafa;
    }
    &:hover .el-button {
      opacity: 1;
    }
    .marker_name {
      display: inline-block;
      font-size: 14px;
      margin: 0;
    }
    .el-button {
      margin-top: -4px;
      float: right;
      transition: opacity .3s;
      margin-right: 10px;
      opacity: 0;
    }
  }
  .selected_marker {
    font-weight: bold;
    background: #eeeeee;
    .el-button {
      opacity: 1;
    }
  }
</style>