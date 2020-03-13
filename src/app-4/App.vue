<template>
  <div class="container">
    <form v-if="!isSubmitted">
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
          <h1>File a Complaint</h1>
          <hr />
          <div class="form-group">
            <label for="email">Mail</label>
            <input
              type="text"
              id="email"
              class="form-control"
              :value="userData.email"
              @input="userData.email = $event.target.value" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              class="form-control"
              v-model.lazy="userData.password"
            />
          </div>
          <div class="form-group">
            <label for="age">Age</label>
            <input type="number" id="age" class="form-control" v-model.number="userData.age" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 form-group">
          <label for="message">Message</label>
          <br />
          <!-- Interpolation between <textarea>{{ test }}</textarea> doesn't work!-->
          <textarea id="message" rows="5" class="form-control" v-model="message"></textarea>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
          <div class="form-group">
            <label for="sendmail">
              <input type="checkbox" id="sendmail" value="SendMail" v-model="sendMail" /> Send Mail
            </label>
            <label for="sendInfomail">
              <input type="checkbox" id="sendInfomail" value="SendInfoMail" v-model="sendMail" /> Send Infomail
            </label>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 form-group">
          <label for="male">
            <input type="radio" id="male" value="Male" v-model="userData.gender" /> Male
          </label>
          <label for="female">
            <input type="radio" id="female" value="Female" v-model="userData.gender" /> Female
          </label>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 form-group">
          <label for="priority">Priority</label>
          <select 
            id="priority"
            class="form-control"
            v-model="selectedPriority">
            <option></option>
            <option
              v-for="(priorityLabel,priorityId) in priorities"
              :value="priorityId"
            >{{ priorityLabel }}</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 form-group">
          <app-switch v-model="dataSwitch"></app-switch>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 form-group">
          <app-cooler-switch v-model="dataCoolerSwitch"></app-cooler-switch>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
          <button
            class="btn btn-primary"
            @click.prevent="onSubmit">Submit!</button>
        </div>
      </div>
    </form>
    <hr />
    <div class="row" v-if="isSubmitted">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h4>Your Data</h4>
          </div>
          <div class="panel-body">
            <p>Mail: {{ userData.email }}</p>
            <p>Password: {{ userData.password }}</p>
            <p>Age: {{ userData.age }}</p>
            <p style="white-space: pre">Message: {{ message }}</p>
            <p>
              <strong>Send Mail?</strong>
            </p>
            <ul>
              <li v-for="option in sendMail">{{ option }}</li>
            </ul>
            <p>Gender: {{ userData.gender }}</p>
            <p>Priority: {{ priorities[selectedPriority] }}</p>
            <p>Switched: {{ switchText(dataSwitch) }}</p>
            <p>Cooler Switch: {{ switchText(dataCoolerSwitch) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SwitchVue from './Switch.vue';
import CoolerSwitchVue from './CoolerSwitch.vue';
export default {
  data() {
    return {
      userData: {
        email: '',
        password: '',
        age: 27,
        gender: 'Male'
      },
      message: 'a new text',
      sendMail: [],
      selectedPriority: 'mdm',
      priorities: {
        'lw': 'Low',
        'mdm': 'Medium',
        'hgh': 'High',
        'crtcl': 'Critical'
      },
      dataSwitch: true,
      dataCoolerSwitch: false,
      isSubmitted: false
    };
  },
  methods: {
    switchText(isOn) {
      return isOn ? 'On' : 'Off'
    },
    onSubmit() {
      this.isSubmitted = true
    }
  },
  components: {
    appSwitch: SwitchVue,
    appCoolerSwitch: CoolerSwitchVue
  }
};
</script>

<style>
</style>
