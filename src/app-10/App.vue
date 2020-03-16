<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <h3>Http</h3>
        <div class="form-group">
          <label for>Username</label>
          <input type="text" class="form-control" v-model="user.username" />
        </div>
        <div class="form-group">
          <label for>E-mail</label>
          <input type="text" class="form-control" v-model="user.email" />
        </div>
        <button class="btn btn-primary" @click.prevent="submit()">Submit</button>
        <hr />
        <input type="text" class="form-control" v-model="node">
        <br><br>
        <button class="btn btn-primary" @click="fetchData">Get Data</button>
        <br />
        <br />
        <ul class="list-group">
          <li class="list-group-item" v-for="(user, userId) of users">
            <h3>{{ userId }}</h3>
            <p>{{ user.username }}</p>
            <strong>{{ user.email }}</strong>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        id: '',
        username: '',
        email: ''
      },
      users: [],
      resource: null,
      node: 'data'
    };
  },
  methods: {
    getData(res) {
      return res.json();
    },
    reverseData(data) {
      const output = {};
      const keys = Object.keys(data);

      for (let i = keys.length; i >= 0; i--) {
        const userId = keys[i]
        const user = data[userId]
        
        if (userId && user) 
          output[userId] = user;
      }

      return output;
    },
    handleError(error) {
      console.error(error);
    },
    submit() {
      /*
        const submitSuccess = data => {
          this.user.id = data.body.name;
        };

        const func = !!this.user.id ? 'post' : 'post';
        this.$http[func]('data.json', this.user).then(submitSuccess, this.handleError);
      */

      /*
        const vm = this
        (async _ => {
          const url = 'https://vue-assignment-4ad0c.firebaseio.com'
          const response = await vm.$http.post(`${url}/user.json`, vm.user)
          console.log(response)
        })()
      */

      // this.resource.save({}, this.user)
      this.resource.saveAlt(this.user)
    },
    fetchData() {
      /*
        this.$http
          .get('data.json')
      */

      this.resource.getData({ node: this.node })
          .then(this.getData, this.handleError)
          .then(this.reverseData)
          .then(users => { this.users = users });
    }
  },
  watch: {
    'user.id'(id) {
      console.log('New user created with id=' + id);
    }
  },
  created() {
    const customActions = {
      saveAlt: { method: 'POST', url: 'alternative.json' },
      getData: { method: 'GET' }
    }

    this.resource = this.$resource('{node}.json', {}, customActions)
  }
};
</script>

<style>
</style>