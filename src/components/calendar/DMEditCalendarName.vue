<template>
  <v-card class="bg-amber-lighten-5" title="Editar nombre del calendario">
    <v-card-text>
      <v-text-field v-model="editedName" label="Nombre del calendario" required :error-messages="nameErrorMessages"
        @keyup.enter="updateCalendarName">
      </v-text-field>
      <v-btn block color="deep-orange-lighten-2" variant="flat" class="text-white" @click="updateCalendarName"
        :disabled="editedName.length === 0">
        Cambiar nombre
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    calendar: Object,
  },
  data() {
    return {
      editedName: this.calendar.name,
      nameErrorMessages: [],
    };
  },
  methods: {
    updateCalendarName() {
      if (this.editedName.length === 0) {
        this.nameErrorMessages = ['El nombre es obligatorio'];
      } else {
        this.$store.dispatch("calendars/updateCalendar", {
          ...this.calendar,
          name: this.editedName,
        });

        this.$emit("updated");
        this.nameErrorMessages = [];
      }
    },
  },
  emits: ["updated"]
};
</script>
