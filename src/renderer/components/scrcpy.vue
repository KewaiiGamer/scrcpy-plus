<template>
  <div>

    <section style="margin-top: 0;" v-if="running">
      <h2>SCRCPY Settings</h2>
      <center>SCRCPY is currently running</center>
    </section>

    <section style="margin-top: 0;" v-if="!running">
      <h2>SCRCPY Settings</h2>


      <!--   Standard Actions   -->
      <v-list-item v-for="(item, i) in args" :key="i">
        <div style="display: flex;">
          
          <v-checkbox
            v-model="selectedArgs"
            :value="item"
            :label="item.arg.replace(/-/g,' ')"
            persistent-hint
            :hint="item.description"
          />

        </div>
        <!--   Sliders   -->
        <div>Video Bitrate {{ bitrate }}M</div>
        <v-slider v-model="bitrate" max="64" min="1" hint="A higher bitrate creates a clearer image but may increase lag"      dense persistent-hint />
        <!--   End Sliders   -->

      </v-list-item>
      <!--   End Standard Actions   -->



      <v-card-actions style="margin-top: 1em;">
        <v-spacer />
        <v-btn @click="scrcpy()" rounded class="primaryButton" :disabled="loading" :loading="loading">Start SCRCPY</v-btn>
      </v-card-actions>
    </section>


    <!--   Error Dialog   -->
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey darken-3">An error has occurred</v-card-title>

        <v-card-text v-text="dialogText" style="margin-top: 2em;" />

        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn rounded class="primaryButton" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--   End Error Dialog   -->

  </div>
</template>

<script>
export default {

  props: {
    serial: String,
    name: String,
  },
  methods: {

    async scrcpy() {
        this.loading = true; // Disable 'Start' Button

        let flags = new String();
        for (const i in this.selectedArgs) {
          flags += ' '+this.selectedArgs[i].arg;
        }
        //console.log("scrcpy"+flags);

        this.$execute(`scrcpy -s ${this.serial} --video-bit-rate ${this.bitrate}M`+flags)
          .catch(err => {
            //if (typeof err != "object" && err.startsWith("INFO:")) return; // Catch information outputs
            console.log(err)
            if (err && err.startsWith("WARN:")) return; // Catch default close
            this.dialog = true;
            this.dialogText = err;
          })
          .then(e => {
            this.running = false;
          });

          setTimeout(() => {
            this.loading = false;
            this.running = true;
          }, 1000);
        
    }

  },
  
  data() {
    return {
      loading: false,
      running: false,

      dialog: false,
      dialogText: null,

      selectedArgs: [],

      bitrate: 8,

      args: [
        {
          arg: "--stay-awake",
          description: "Prevent the device from sleeping"
        },
      ],
    }
  },
}
</script>
