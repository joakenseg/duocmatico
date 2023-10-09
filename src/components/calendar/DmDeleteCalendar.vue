<template>
  <v-card class="bg-amber-lighten-5">
    <v-card-text>
      <v-alert class="rounded-lg" type="warning" variant="tonal" icon="mdi-alert-circle">
        ¿Estás seguro de que deseas eliminar este item?
      </v-alert>
      <v-btn block color="deep-orange-lighten-2" variant="flat" class="text-white mt-3" @click="confirmDelete">
        Sí, eliminar este calendario
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "DmDeleteCalendar",

  props: {
    calendar: Object,
  },

  methods: {
    ...mapActions("calendars", ["removeCalendar"]),
    confirmDelete() {
      if (this.calendar) {
        this.removeCalendar(this.calendar).then(() => {
          this.$emit("deleted-successfully");
        });
      }
    },
  },
};
</script>