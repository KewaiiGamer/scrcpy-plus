<template>
  <div style="scrollbar-width: thin;">
    {{serial}}

    <scrcpy :serial="this.serial" v-if="deviceConnected && !mirrorEngine" />
    <mirror v-if="deviceConnected && mirrorEngine" />
    <!--   End Import Modules   -->
  </div>
</template>

<script>
import scrcpyPlusInfo from '../components/scrcpyPlusInfo.vue'
export default {
  props: {
    serial: String,
    name: String,
  },
  components: { scrcpyPlusInfo },
  data() {
    return {
      deviceConnected: false,
    }
  },
  computed: {
    mirrorEngine: vm => localStorage.getItem("set-mirror") == 'true' ? true : false
  }
}
</script>
