<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <h3>Animations</h3>
        <hr />
        <div class="form-group">
          <select class="form-control" v-model="animationType">
            <option value="fade">Fade Animation</option>
            <option value="slide">Slide Animation</option>
          </select>
        </div>
        <button class="btn btn-primary" @click="show = !show">Show Alert</button>
        <div class="clearfix">&nbsp;</div>
        <transition :name="animationType">
          <div class="alert alert-info" v-if="show">This is a info</div>
        </transition>
        <div class="clearfix">&nbsp;</div>
        <transition name="fade">
          <div class="alert alert-info" v-if="show">This is a info</div>
        </transition>
        <transition name="slide" type="animation">
          <div class="alert alert-info" v-if="show">This is a info</div>
        </transition>
        <transition name="fade" appear>
          <div class="alert alert-info" v-if="show">This is a info</div>
        </transition>
        <transition appear enter-active-class="animated shake" leave-active-class="animated hinge">
          <div class="alert alert-info" v-if="show">This is a info</div>
        </transition>
        <transition :name="animationType" mode="out-in">
          <div class="alert alert-info" v-if="show" key="info">This is some info</div>
          <div class="alert alert-warning" v-else key="warning">This is some warning</div>
        </transition>
        <button class="btn btn-primary" @click="load = !load">Load / Remove Element</button>
        <br />
        <br />
        <transition
          @before-enter="beforeEnter"
          @enter="enter"
          @after-enter="afterEnter"
          @enter-cancelled="enterCancelled"
          @before-leave="beforeLeave"
          @leave="leave"
          @after-leave="afterLeave"
          @leave-cancelled="leaveCancelled"
          :css="false"
        >
          <div style="width: 100px; height: 100px; background: lightgreen" v-show="load"></div>
        </transition>
        <hr />
        <!-- @click="ViewUtils.toggleComponents(vm.selectedComponent, 'app-success-alert', 'app-danger-alert')" -->
        <button class="btn btn-primary" @click="toggleComponents()">Toggle Component</button>
        <br />
        <transition name="fade" mode="out-in">
          <component :is="selectedComponent"></component>
        </transition>
        <hr />
        <button class="btn btn-primary" @click="addItem">Add Item</button>
        <br />
        <br />
        <ul class="list-group">
          <transition-group name="slide">
            <li
              class="list-group-item"
              v-for="(number, index) in numbers"
              :key="`list${index}`"
              @click="removeItem(index)"
              style="cursor: pointer"
            >{{ number }}</li>
          </transition-group>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import DangerAlertVue from './DangerAlert.vue';
import SuccessAlertVue from './SuccessAlert.vue';
import { ViewUtils } from './utils/view.utils';
import { animateWidthMixin } from './mixins/animateWidth.mixin';
export default {
  mixins: [animateWidthMixin],
  data() {
    return {
      vm: this,
      ViewUtils: ViewUtils,
      show: false,
      animationType: 'fade',
      selectedComponent: 'app-success-alert',
      numbers: [1, 2, 3, 4, 5]
    };
  },
  components: {
    appDangerAlert: DangerAlertVue,
    appSuccessAlert: SuccessAlertVue
  },
  methods: {
    addItem(item) {
      const pos = Math.floor(Math.random() * this.numbers.length);
      this.numbers.splice(pos, 0, this.numbers.length + 1);
    },
    removeItem(index) {
      this.numbers.splice(index, 1);
    },
    toggleComponents() {
      this.selectedComponent =
        this.selectedComponent === 'app-success-alert'
          ? 'app-danger-alert'
          : 'app-success-alert';
    }
  }
};
</script>

<style lang="scss" scoped>
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 1s;
}
.fade-leave {
}
.fade-leave-active {
  transition: opacity 1s;
  opacity: 0;
}

.slide-enter {
  opacity: 0;
  /* transform: translateY(20px); */
}
.slide-enter-active {
  animation: slide-in 1s ease-out forwards;
  transition: opacity 0.5s;
}
.slide-leave {
}
.slide-leave-active {
  animation: slide-out 1s ease-out forwards;
  transition: opacity 3s;
  opacity: 0;
}
.slide-move {
  transition: transform 1s;
}

@keyframes slide-in {
  from {
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-out {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(20px);
  }
}
</style>