<template>
  <div class="grid-link-name-modal">
    <div
      class="modal fade"
      id="gridLinkNameModal"
      tabindex="-1"
      role="dialog"
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
              <span aria-hidden="true" @click="closeModal">
                <i class="fas fa-times" style="color: white;"></i>
              </span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="linkDescription">Link description:</label>
              <input
                type="text"
                class="form-control"
                v-model="linkDescription"
                id="linkDescription"
                placeholder="Enter a great link description..."
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-gray" data-dismiss="modal" @click="closeModal">Close</button>
            <button type="button" class="btn btn-success btn-green" @click="saveLinkDescription">Save</button>
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
            linkDescription: ''
        }
    },
    methods: {
        saveLinkDescription() {
            const { linkKey, linkDescription } = this

            if (!gridArrowAttributesService.linkAttribute) {
                gridIOservice.setNewLinkAttribute(linkKey)
                linkNameHelper.setLinkAttribute(linkDescription, linkKey)
            }

            gridArrowAttributesService.linkAttribute.name = linkDescription
            
            linkNameHelper.setNewName(linkKey, linkDescription)
            gridHistoryService.saveState()

            this.closeModal()
        },
        updateLinkDescription() {
            const { linkKey, linkAttribute } = gridArrowAttributesService
            this.linkKey = linkKey  
            
            this.linkDescription = ''

            if (linkAttribute)
                this.linkDescription = gridArrowAttributesService.linkAttribute.name
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