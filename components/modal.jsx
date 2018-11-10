const Modal = ({ showModal, filename, doChange, hideModal, saveChange }) => (
  <div
    className={`modal fade${showModal ? ' show' : ''}`}
    id="editModal"
    tabIndex="-1"
    role="dialog"
    aria-labelledby="editModal"
    aria-hidden="true"
    style={{ display: `${showModal ? 'block' : 'none'}` }}
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Edit Filename
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={hideModal}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form>
            <div className="form-group">
              <label htmlFor="recipient-name" className="col-form-label">
                Filename:
              </label>
              <input
                type="text"
                className="form-control"
                value={filename}
                onChange={doChange}
                id="new-filename"
              />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
            onClick={hideModal}
          >
            Cancel
          </button>
          <button type="button" className="btn btn-dark" onClick={saveChange}>
            Save
          </button>
        </div>
      </div>
    </div>
    <style jsx>{`
      .modal-content {
        background: #262831;
      }
      span {
        color: #fff;
      }
      input#new-filename {
        color: #fff;
        background: #6c757d;
      }
    `}</style>
  </div>
)

export default Modal
