<template>
  <div class="grid-link-name-modal">
    <div
      class="modal fade"
      id="gridLinkNameModal"
      tabindex="-1"
      role="dialog"
      data-backdrop="static"
      data-keyboard="false"
      aria-labelledby="gridLinkNameModalTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="gridLinkNameModalTitle">
              <i class="far fa-keyboard"></i>
              Change Description
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
            <div class="form-group">
              <label for="name">Link description:</label>
              <input
                type="text"
                class="form-control"
                v-model="name"
                id="name"
                placeholder="Enter a great link description..."
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-gray" @click.prevent="closeModal">Close</button>
            <button type="button" class="btn btn-success btn-green" @click.prevent="saveName">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import { gridArrowAttributesService } from "../services/gridArrowAttributes.service"
import { gridIOservice } from "../../../models/grid/services/gridIO.service";
import { gridHistoryService } from "../../../models/grid/services/gridHistory.service"
import { linkNameHelper } from "../../../models/grid/helpers/link-attributes/linkName.helper"
export default {
    data() {
        return {
            linkKey: '',
            name: ''
        }
    },
    methods: {
        saveName() {
            const { linkKey, name } = this
            const existsLinkAttribute = gridModel.existsLinkAttribute(linkKey)
            
            if (!existsLinkAttribute)
              gridIOservice.setNewLinkAttribute(linkKey)

            const linkAttribute = gridModel.getLinkAttribute(linkKey)
            linkAttribute.name = name
            
            linkNameHelper.setGridLinkNameElement({ name, linkKey })
            gridHistoryService.saveState()

            this.closeModal()
        },
        updateComponent() {
            const { linkKey } = gridArrowAttributesService
            this.linkKey = linkKey  
            this.name = ''

            const linkAttribute = gridModel.getLinkAttribute(linkKey)
            if (linkAttribute)
                this.name = linkAttribute.name
        },
        closeModal() {
            $('#gridLinkNameModal').modal('hide')
            gridArrowAttributesService.isModalOpened = false
        }
    }
};
</script>

<style lang="scss" scoped>
.grid-link-name-modal {
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