<template>
  <div class="go-to-modal">
    <div
      class="modal fade"
      id="goToModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="goToModalTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="goToModalTitle">
                <i class="fas fa-directions"></i>
                Go To Configuration
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">
                  <i class="fas fa-times"></i>
              </span>
            </button>
          </div>
          <div class="modal-body">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec gravida iaculis mattis. Maecenas placerat consectetur nunc vel volutpat. Nulla quis tortor eget arcu porta aliquam. Duis aliquet dui eu aliquet gravida. Aliquam sed efficitur arcu. Sed sed ex sed ante molestie sagittis nec lacinia diam. Vivamus neque risus, dictum nec lacus id, commodo lacinia purus. Fusce in ipsum nulla. In tempor augue mollis est egestas, vitae ultricies mi luctus. Nulla pellentesque fermentum lacinia.</p>
              <p>Suspendisse potenti. Aenean non mi porttitor diam pulvinar sollicitudin eu et velit. Morbi nec felis ut arcu dignissim pellentesque vel sollicitudin eros. Suspendisse varius tellus nec cursus bibendum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut pulvinar et nisl ut sagittis. Praesent euismod dignissim tempor. Donec malesuada quam quis augue rutrum euismod. Proin id rutrum nisl, eget imperdiet tellus. Nullam eu justo vel tellus finibus iaculis. Fusce tristique orci vel felis imperdiet, eu tincidunt dolor vestibulum.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-gray" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-success btn-green">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
    .go-to-modal {
        .modal-header {
            padding: 20px 30px;
            background: black;
        }
        .modal-title {
            color: white;
            font-size: 24px;
            i {
                color: white;
                font-size: 30px;
                margin-right: 10px;
                vertical-align: middle;
            }
        }
        .modal-body {
            color: black;
        }
        .modal-footer {
            button.btn-green {
                font-size: 18px;
            }
            button.btn-gray {
                font-size: 17px;
            }
        }
    }
</style>