<template>
  <div 
    id="grid-arrow-attributes"
    draggable="false"
  >
    <i class="fas fa-pen-square fa-fill edit-icon"></i>

    <div class="grid-arrow-attributes-box">
      <button @click="editAttributes">
        <i class="fas fa-cogs"></i>
        Edit Attributes
      </button>
      <button @click="changeDescription">
        <i class="far fa-keyboard"></i>
        Change Description
      </button>
      <button class="delete-button" @click.prevent="deleteLink">
        <i class="fas fa-minus-circle"></i>
        Delete Link
      </button>
    </div>
  </div>
</template>

<script>
import { gridArrowAttributesService } from '../../services/gridArrowAttributes.service'
export default {
  methods: {
    editAttributes() {
      document.querySelector('.grid-link-attributes-modal').__vue__.updateComponent()
      this.openModal('#gridLinkAttributesModal')
    },
    changeDescription() {
      document.querySelector('.grid-link-name-modal').__vue__.updateComponent()
      this.openModal('#gridLinkNameModal')
    },
    deleteLink() {
      gridArrowAttributesService.deleteLink()
    },
    openModal(selectorId) {
      $(selectorId).modal();
      gridArrowAttributesService.isModalOpened = true
      gridArrowAttributesService.hideArrowAttributes()
    }
  },
  mounted() {
    gridArrowAttributesService.selectorId = 'grid-arrow-attributes'
  }
}
</script>

<style lang="scss">
    #grid-arrow-attributes {
        position: fixed;
        display: none;
        z-index: 2;
        cursor: pointer;
        color: #33bd58;
        background: white;

        i.edit-icon {
            position: relative;
            z-index: 2;
        }

        .grid-arrow-attributes-box {
          z-index: 1;
          position: absolute;
          top: 15px;
          left: 10px;

          width: 200px;
          box-shadow: 0px 0px 5px #cecece;
          background: white;
          border-radius: 0 10px 10px 10px;
          margin: 0;
          padding: 15px;
          display: flex;
          flex-direction: column;

          button {
            font-size: 11px;
            background: none;
            color: #000;
            border: 1px solid;
            width: 100%;
            margin: 3px 0;
            padding: 10px;
            border-radius: 5px;

            &.delete-button {
              background: red;
              color: white;
              font-weight: bold;
              font-size: 12px;
            }
          }
        }
    }
</style>