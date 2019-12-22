import React from 'react';
import { Link } from 'react-router-dom';
import { FilePond, registerPlugin } from 'react-filepond';
import rootDispatcher from '../utils/rootDispatcher';
import req from '../utils/req';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { Badge, Table, Pagination, PaginationItem, PaginationLink, Progress, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Col, Row } from 'reactstrap';

export default class User extends React.Component {
  constructor() {
    super();
    this.state = {
      presignedUrl: '',
    };
    registerPlugin(FilePondPluginFileValidateType);
  }

  componentWillMount() {
    this.getPresignedUrl();
  }

  getPresignedUrl = () => {
    req.get(`/getpresignedurl`).then(({ success, body }) => {
      if (!success) {
        rootDispatcher.dispatch('NB:OPEN', {
          type: 'error',
          msg: body.message,
        });

        return;
      }

      console.log(body);

      this.setState({
        presignedUrl: body.presignedUrl,
      });
    });
  };

  fileUploaded = () => {

  }

  onFileValidate = () => {

  }

  render() {
    const { presignedUrl } = this.state;
    return (
      <React.Fragment>
        <div className="card p-3">
          <div className="row">
            <div className="col-12">
              <h5 className="h--lower h--normalize-weight">Upload File</h5>
              <label>Drop file below </label>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <FilePond
                ref={ref => (this.pond = ref)}
                onremovefile={() => {
                  if (this.s3UploadRequest) {
                    this.s3UploadRequest.abort();
                  }
                }}
                beforeAddFile={item => {
                  try {
                    let abortProcessor = this.pondContainer.querySelector(
                      ".filepond--action-abort-item-processing"
                    );
                    if (abortProcessor) {
                      this.pondContainer
                        .querySelector(".filepond--action-abort-item-processing")
                        .addEventListener("click", e => {
                          e.preventDefault();
                          this.pond.removeFile();
                        });
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
                disabled={presignedUrl == ""}
                required={true}
                checkValidity={true}
                allowMultiple={false}
                name="file"
                allowFileTypeValidation={true}
                fileValidateTypeDetectType={(source, type) =>
                  new Promise((resolve, reject) => {
                    // Do custom type detection here and return with promise
                    var a = source.name.split(".");
                    const ext = a.pop();

                    if (ext == "csv") {
                      this.onFileValidate();
                      resolve(".csv");
                      return;
                    } else {
                      reject("Wrong file")
                    }
                  })
                }
                labelTapToUndo="tap X to remove"
                // acceptedFileTypes={[
                //   "application/zip",
                // ]}
                server={{
                  url: "",
                  process: (
                    fieldName,
                    file,
                    metadata,
                    load,
                    error,
                    progress,
                    abort
                  ) => {
                    const self = this;
                    self.s3UploadRequest = new XMLHttpRequest();
                    self.s3UploadRequest.open("PUT", presignedUrl);

                    self.s3UploadRequest.upload.onprogress = e => {
                      progress(e.lengthComputable, e.loaded, e.total);
                    };

                    self.s3UploadRequest.onload = () => {
                      if (
                        self.s3UploadRequest.status >= 200 &&
                        self.s3UploadRequest.status < 300
                      ) {
                        // this.fileUploaded(self.state.s3ObjectFileName);
                        load(self.s3UploadRequest.responseText);
                      } else {
                        // this.fileUploaded(false);
                        error("Error uploading");
                      }
                    };

                    self.s3UploadRequest.send(file);
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-8">
            <div className="card p-3">
              <label>Analytics</label>
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>File type</th>
                    <th>Uploads</th>
                    <th>Username</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="tr--hightlight">
                    <td scope="row">1</td>
                    <td>csv</td>
                    <td>36</td>
                    <td>@mdo</td>
                  </tr>
                  <tr className="tr--hightlight">
                    <td scope="row">2</td>
                    <td>doc</td>
                    <td>26</td>
                    <td>@fat</td>
                  </tr>
                  <tr className="tr--hightlight">
                    <td scope="row">3</td>
                    <td>xml</td>
                    <td>74</td>
                    <td>@twitter</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
          <div className="col-4 pl-0">
            <div className="card p-3">
                <label>Total uploads</label>
                <p className="m-0">
                  <Badge color="primary">36 CSV</Badge>
                  <Progress max="100" value="36" color="primary" />
                </p>
                <p className="m-0">
                  <Badge color="primary">26 DOC</Badge>
                  <Progress max="100" value="26" color="danger" />
                </p>
                <p className="m-0">
                  <Badge color="primary">74 XML</Badge>
                  <Progress max="100" value="74" color="primary" />
                </p>
                <p className="m-0">
                  <Badge color="primary">64 DOCX</Badge>
                  <Progress max="100" value="64" color="primary" />
                </p>
            </div>
          </div>
        </div>

        <div className="row mt-3 mb-3">
          <div className="col-12">
            <div className="card p-3">
              <label>Uploaded files</label>
              <Table hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>File</th>
                    <th>Uploaded by</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="tr--link tr--hightlight">
                    <td scope="row">1</td>
                    <td>86876786-868685888978-987979879797</td>
                    <td>admin</td>
                  </tr>
                  <tr className="tr--link tr--hightlight">
                    <td scope="row">2</td>
                    <td>86876786-868685888978-987979879797</td>
                    <td>@fat</td>
                  </tr>
                  <tr className="tr--link tr--hightlight">
                    <td scope="row">3</td>
                    <td>86876786-868685888978-987979879797</td>
                    <td>@twitter</td>
                  </tr>
                </tbody>
              </Table>
              <Row>
                <Col>
                <Pagination
                  className="pagination justify-content-end"
                  listClassName="justify-content-end"
                >
                  <PaginationItem className="disabled">
                    <PaginationLink
                      href="#pablo"
                      onClick={e => e.preventDefault()}
                      tabIndex="-1"
                    >
                      <i className="fa fa-angle-left" />
                      <span className="sr-only">Previous</span>
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#pablo" onClick={e => e.preventDefault()}>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem className="active">
                    <PaginationLink href="#pablo" onClick={e => e.preventDefault()}>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#pablo" onClick={e => e.preventDefault()}>
                      3
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#pablo" onClick={e => e.preventDefault()}>
                      <i className="fa fa-angle-right" />
                      <span className="sr-only">Next</span>
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
