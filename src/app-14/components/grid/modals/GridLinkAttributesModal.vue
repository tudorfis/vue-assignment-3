<template>
  <div class="grid-link-attributes-modal">
    <div
      class="modal fade"
      id="gridLinkAttributesModal"
      tabindex="-1"
      role="dialog"
      data-backdrop="static"
      data-keyboard="false"
      aria-labelledby="gridLinkAttributesTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="gridLinkAttributesTitle">
              <i class="fas fa-cogs"></i>
              Link Settings
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              style="opacity: 1;"
            >
              <span aria-hidden="true" @click.prevent="closeModal">
                <i class="fas fa-times" style="color: white;"></i>
              </span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row" style="margin-top: 15px;">
                <div class="col">
                  <div class="form-group">
                    <label>Line color</label>
                    <div class="color-circle-wrapper">
                      <div
                        v-for="color of colors"
                        @click="linkAttributesModel.color = color"
                        :style="{'background-color': color }"
                        :class="{'selected': linkAttributesModel.color === color }"
                        class="color-circle-picker"
                      >&nbsp;</div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <label>Line head</label>
                    <div class="images-wrapper">
                      <img
                        src="src/app-14/assets/img/control-icons/line-settings/line-head/line-head-1.png"
                        @click="linkAttributesModel.hideHead = false"
                        :class="{selected: linkAttributesModel.hideHead === false }"
                      />
                      <img
                        src="src/app-14/assets/img/control-icons/line-settings/line-head/line-head-2.png"
                        @click="linkAttributesModel.hideHead = true"
                        :class="{selected: linkAttributesModel.hideHead === true }"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label>Line thickness</label>
                    <div class="images-wrapper">
                      <img
                        src="src/app-14/assets/img/control-icons/line-settings/line-thickness/line-thickness1.png"
                        @click="linkAttributesModel.width = '-2'"
                        :class="{selected: linkAttributesModel.width === '-2' }"
                      />
                      <img
                        src="src/app-14/assets/img/control-icons/line-settings/line-thickness/line-thickness2.png"
                        @click="linkAttributesModel.width = ''"
                        :class="{selected: linkAttributesModel.width === '' }"
                      />
                      <img
                        src="src/app-14/assets/img/control-icons/line-settings/line-thickness/line-thickness3.png"
                        @click="linkAttributesModel.width = '3'"
                        :class="{selected: linkAttributesModel.width === '3' }"
                      />
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <label>Line pattern</label>
                    <div class="images-wrapper">
                      <img
                        src="src/app-14/assets/img/control-icons/line-settings/line-pattern/line-pattern1.png"
                        @click="linkAttributesModel.style = ''"
                        :class="{selected: linkAttributesModel.style === '' }"
                      />
                      <img
                        src="src/app-14/assets/img/control-icons/line-settings/line-pattern/line-pattern2.png"
                        @click="linkAttributesModel.style = 'dashed'"
                        :class="{selected: linkAttributesModel.style === 'dashed' }"
                      />
                      <img
                        src="src/app-14/assets/img/control-icons/line-settings/line-pattern/line-pattern3.png"
                        @click="linkAttributesModel.style = 'dotted'"
                        :class="{selected: linkAttributesModel.style === 'dotted' }"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="form-group">
                  <label>Force outbound side</label>
                  <div class="images-wrapper">
                    <img
                      src="src/app-14/assets/img/control-icons/line-settings/force-outbound/force-outbound1.png"
                      @click="linkAttributesModel.outDirection = ''"
                      :class="{selected: linkAttributesModel.outDirection === '' }"
                    />
                    <img
                      src="src/app-14/assets/img/control-icons/line-settings/force-outbound/force-outbound2.png"
                      @click="linkAttributesModel.outDirection = 'right'"
                      :class="{selected: linkAttributesModel.outDirection === 'right' }"
                    />
                    <img
                      src="src/app-14/assets/img/control-icons/line-settings/force-outbound/force-outbound3.png"
                      @click="linkAttributesModel.outDirection = 'down'"
                      :class="{selected: linkAttributesModel.outDirection === 'down' }"
                    />
                    <img
                      src="src/app-14/assets/img/control-icons/line-settings/force-outbound/force-outbound4.png"
                      @click="linkAttributesModel.outDirection = 'left'"
                      :class="{selected: linkAttributesModel.outDirection === 'left' }"
                    />
                    <img
                      src="src/app-14/assets/img/control-icons/line-settings/force-outbound/force-outbound5.png"
                      @click="linkAttributesModel.outDirection = 'up'"
                      :class="{selected: linkAttributesModel.outDirection === 'up' }"
                    />
                  </div>
                </div>
              </div>
              <div class="row" style="margin-bottom: 0">
                <div class="form-group">
                  <label>Force inbound side</label>
                  <div class="images-wrapper">
                    <img
                      src="src/app-14/assets/img/control-icons/line-settings/force-inbound/force-inbound1.png"
                      @click="linkAttributesModel.inDirection = ''"
                      :class="{selected: linkAttributesModel.inDirection === '' }"
                    />
                    <img
                      src="src/app-14/assets/img/control-icons/line-settings/force-inbound/force-inbound2.png"
                      @click="linkAttributesModel.inDirection = 'left'"
                      :class="{selected: linkAttributesModel.inDirection === 'left' }"
                    />
                    <img
                      src="src/app-14/assets/img/control-icons/line-settings/force-inbound/force-inbound3.png"
                      @click="linkAttributesModel.inDirection = 'up'"
                      :class="{selected: linkAttributesModel.inDirection === 'up' }"
                    />
                    <img
                      src="src/app-14/assets/img/control-icons/line-settings/force-inbound/force-inbound4.png"
                      @click="linkAttributesModel.inDirection = 'right'"
                      :class="{selected: linkAttributesModel.inDirection === 'right' }"
                    />
                    <img
                      src="src/app-14/assets/img/control-icons/line-settings/force-inbound/force-inbound5.png"
                      @click="linkAttributesModel.inDirection = 'down'"
                      :class="{selected: linkAttributesModel.inDirection === 'down' }"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary btn-gray"
              @click.prevent="closeModal"
            >Close</button>
            <button 
              type="button"
              class="btn btn-success btn-green"
              @click.prevent="saveLinkAttributes"
            >Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { gridArrowAttributesService } from "../services/gridArrowAttributes.service";
import { gridIOservice } from "../../../models/grid/services/gridIO.service";
import { gridHistoryService } from "../../../models/grid/services/gridHistory.service";
import { linkAttributeColors, linkAttributeBlueprint } from "../../../models/grid/grid.blueprints";
import { Utils } from "../../../utils/utils"

export default {
  data() {
    return {
      linkKey: '',
      linkAttributesModel: {},
      colors: linkAttributeColors
    };
  },
  methods: {
    saveLinkAttributes() {
      const { linkKey, linkAttributesModel } = this

      if (!gridArrowAttributesService.linkAttribute)
        gridIOservice.setNewLinkAttribute(linkKey)

      gridModel.model.linkAttributes[linkKey] = Utils.deepclone(this.linkAttributesModel)

      gridLinksBuilderService.buildLinks()
      gridArrowAttributesService.resetLeftTop()

      gridHistoryService.saveState()
      this.closeModal()
    },
    updateComponent() {
      const { linkKey } = gridArrowAttributesService
      const existsLinkAttribute = gridModel.existsLinkAttribute(linkKey)
      
      this.linkAttributesModel =  existsLinkAttribute ? 
        Utils.deepclone(gridModel.getLinkAttribute(linkKey)) :
        Utils.deepclone(linkAttributeBlueprint)

      this.linkKey = linkKey
    },
    closeModal() {
      $('#gridLinkAttributesModal').modal('hide')
      gridArrowAttributesService.isModalOpened = false
    }
  }
}
</script>

<style lang="scss">
.images-wrapper {
  display: flex;
  flex-direction: row;
  img {
    border: 3px solid #ccc;
    border-radius: 5px;
    margin-right: 30px;
    cursor: pointer;
    &.selected {
      border: 5px solid #5bc2f1;
    }
  }
}
.color-circle-wrapper {
  display: flex;
  flex-direction: row;
  .color-circle-picker {
    width: 35px;
    height: 35px;
    cursor: pointer;
    border-radius: 25px;
    margin-right: 3px;
    &.selected {
      border: 3px solid #000;
      width: 45px;
      height: 45px;
      margin: -6px 7px 0 5px;
    }
  }
}

.grid-link-attributes-modal {
  user-select: none;
  .modal-header {
    padding: 20px 30px;
    background: #333;
  }
  .modal-title {
    color: white;
    font-size: 20px;
    i {
      color: white;
      font-size: 30px;
      margin-right: 10px;
      vertical-align: middle;
    }
  }
  .modal-body {
    color: #666;
    padding: 20px 50px;
    form {
      label {
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: bold;
      }
    }
    .row {
      margin-bottom: 20px;
    }
  }
  .modal-footer {
    button.btn-green {
      font-size: 16px;
    }
    button.btn-gray {
      font-size: 16px;
    }
  }
}
</style>