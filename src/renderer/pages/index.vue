<template>
  <div style="scrollbar-width: thin;">

    <v-tabs
      v-model="tab"
      bg-color="primary"
    >
      <v-tab
        v-for="(item, i) in devices"
        v-show="item && !loading"
        :key="item.serial"
      >
        {{ item.serial }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="(item, i) in devices"
        v-show="item && !loading"
        :key="item.serial"
      >
          <tab :serial="item.serial" :name="item.name"/>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import scrcpyPlusInfo from '../components/scrcpyPlusInfo.vue'
import tab  from "./tab.vue";
export default {
  components: {tab, scrcpyPlusInfo },
  data() {
    return {
      tab: null,
      devices: [],
      loading: false,
    }
  },
  methods: {

    async getDevices() {
      this.loading = true;

      this.$devices.start(devices => {
        const lines = devices.split('\n')
        const allDevices = lines.slice(1, lines.length-2)
        for (const device of allDevices) {
          const parts = device.split('\t')
          this.devices.push({'serial': parts[0], 'name': parts[1].replace('\r', '')})
        }
        console.log(this.devices)
      });

      this.loading = false;
    }

  },
  created() {
    this.getDevices()

  },

  computed: {
    mirrorEngine: vm => localStorage.getItem("set-mirror") == 'true' ? true : false
  }
}
</script>
