// File: EditManageUruForm.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./EditManageUruForm.css";

type SocialLink = { id: string; url: string };

const initialFormData = {
  // Step 1
  positionType: "", // "Unique Record" | "Unique Activity"

  // Step 2 - Applicant Details
  applicationNumber: "",
  applicantName: "",
  sex: "",
  dob: "",
  address: "",
  district: "",
  state: "",
  country: "",
  pinCode: "",
  education: "",
  whatsapp: "",
  email: "",
  occupation: "",
  formCategory: "",
  price: "",

  // Step 3 - Record / Activity Details
  effortType: "",
  recordTitle: "",
  recordDescription: "",
  attemptPurpose: "",
  attemptDate: "",
  venue: "",
  organisation: "",

  // Step 4 - Social (we'll manage arrays separately)

  // Step 5 - Witness
  witness1: {
    name: "",
    designation: "",
    address: "",
    mobile: "",
    email: "",
  },
  witness2: {
    name: "",
    designation: "",
    address: "",
    mobile: "",
    email: "",
  },

  // Payment
  paymentId: "",
  paymentStatus: "",
};

const EditManageUruForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<any>(initialFormData);

  // social links per platform (allow multiple entries)
  const [instagram, setInstagram] = useState<SocialLink[]>([]);
  const [facebook, setFacebook] = useState<SocialLink[]>([]);
  const [linkedin, setLinkedin] = useState<SocialLink[]>([]);
  const [xLinks, setXLinks] = useState<SocialLink[]>([]);
  const [pinterest, setPinterest] = useState<SocialLink[]>([]);
  const [gdrive, setGdrive] = useState<SocialLink[]>([]);
  const [youtube, setYoutube] = useState<SocialLink[]>([]);
  const [otherMedia, setOtherMedia] = useState<SocialLink[]>([]);

  const next = () => setStep((s) => Math.min(6, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const update = (path: string, value: any) => {
    setFormData((fd: any) => ({ ...fd, [path]: value }));
  };

  const updateWitness = (which: "witness1" | "witness2", field: string, value: any) => {
    setFormData((fd: any) => ({
      ...fd,
      [which]: { ...fd[which], [field]: value },
    }));
  };

  const addLink = (setter: React.Dispatch<React.SetStateAction<SocialLink[]>>) => {
    setter((arr) => [...arr, { id: Date.now().toString(), url: "" }]);
  };

  const updateLink = (
    arr: SocialLink[],
    setter: React.Dispatch<React.SetStateAction<SocialLink[]>>,
    id: string,
    value: string
  ) => {
    setter(arr.map((l) => (l.id === id ? { ...l, url: value } : l)));
  };

  const removeLink = (
    arr: SocialLink[],
    setter: React.Dispatch<React.SetStateAction<SocialLink[]>>,
    id: string
  ) => {
    setter(arr.filter((l) => l.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Final data object
    const payload = {
      ...formData,
      social: {
        instagram,
        facebook,
        linkedin,
        xLinks,
        pinterest,
        gdrive,
        youtube,
        otherMedia,
      },
    };

    console.log("Submitting payload:", payload);
    alert("Form submitted — check console for payload (replace with API call)");
  };

  return (
    <div className="EditManageUru-root">
      <div className="EditManageUru-card">
        <header className="EditManageUru-header">
          <h1 className="EditManageUru-title">Edit Applicant {id ? `#${id}` : ""}</h1>
          <div className="EditManageUru-steps">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`EditManageUru-step ${step === s ? "active" : step > s ? "done" : ""}`}
                onClick={() => setStep(s)}
              >
                <span className="EditManageUru-stepNumber">{s}</span>
                <small className="EditManageUru-stepLabel">
                  {s === 1 && "Position"}
                  {s === 2 && "Applicant"}
                  {s === 3 && "Record"}
                  {s === 4 && "Social"}
                  {s === 5 && "Witness"}
                  {s === 6 && "Payment"}
                </small>
              </div>
            ))}
          </div>
        </header>

        <form className="EditManageUru-form" onSubmit={handleSubmit}>
          {/* STEP 1 - Position */}
          {step === 1 && (
            <section className="EditManageUru-stepSection">
              <h2 className="EditManageUru-sectionTitle">Step 1: Position Applied For</h2>
              <div className="EditManageUru-checkboxGroup">
                <label className="EditManageUru-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.positionType === "Unique Record"}
                    onChange={(e) =>
                      update(
                        "positionType",
                        e.target.checked ? "Unique Record" : formData.positionType === "Unique Record" ? "" : formData.positionType
                      )
                    }
                  />
                  <span>Unique Record</span>
                </label>

                <label className="EditManageUru-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.positionType === "Unique Activity"}
                    onChange={(e) =>
                      update(
                        "positionType",
                        e.target.checked ? "Unique Activity" : formData.positionType === "Unique Activity" ? "" : formData.positionType
                      )
                    }
                  />
                  <span>Unique Activity</span>
                </label>

                <p className="EditManageUru-hint">Tip: choose one (toggle behaviour). You can later change it.</p>
              </div>
            </section>
          )}

          {/* STEP 2 - Applicant Details */}
          {step === 2 && (
            <section className="EditManageUru-stepSection">
              <h2 className="EditManageUru-sectionTitle">Step 2: Applicant Details</h2>

              <div className="EditManageUru-grid2">
                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Application Number</span>
                  <input value={formData.applicationNumber} onChange={(e) => update("applicationNumber", e.target.value)} />
                </label>

                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Applicant Name</span>
                  <input value={formData.applicantName} onChange={(e) => update("applicantName", e.target.value)} />
                </label>

                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Sex</span>
                  <select value={formData.sex} onChange={(e) => update("sex", e.target.value)}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Trans">Trans</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Date of Birth</span>
                  <input type="date" value={formData.dob} onChange={(e) => update("dob", e.target.value)} />
                </label>

                <label className="EditManageUru-field full">
                  <span className="EditManageUru-label">Address</span>
                  <textarea value={formData.address} onChange={(e) => update("address", e.target.value)} />
                </label>

                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">District</span>
                  <input value={formData.district} onChange={(e) => update("district", e.target.value)} />
                </label>

                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">State</span>
                  <input value={formData.state} onChange={(e) => update("state", e.target.value)} />
                </label>

                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Country</span>
                  <input value={formData.country} onChange={(e) => update("country", e.target.value)} />
                </label>

                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Pin Code</span>
                  <input value={formData.pinCode} onChange={(e) => update("pinCode", e.target.value)} />
                </label>

                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Educational Qualification</span>
                  <input value={formData.education} onChange={(e) => update("education", e.target.value)} />
                </label>

                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Whatsapp Mobile Number</span>
                  <input value={formData.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
                </label>

                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Email Id</span>
                  <input type="email" value={formData.email} onChange={(e) => update("email", e.target.value)} />
                </label>

                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Occupation</span>
                  <input value={formData.occupation} onChange={(e) => update("occupation", e.target.value)} />
                </label>

                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Form Category</span>
                  <select value={formData.formCategory} onChange={(e) => update("formCategory", e.target.value)}>
                    <option value="">Select category</option>
                    <option value="Cat A">Category A</option>
                    <option value="Cat B">Category B</option>
                    <option value="Cat C">Category C</option>
                  </select>
                </label>

                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Price</span>
                  <input value={formData.price} onChange={(e) => update("price", e.target.value)} />
                </label>
              </div>
            </section>
          )}

          {/* STEP 3 - Record / Activity Details */}
          {step === 3 && (
            <section className="EditManageUru-stepSection">
              <h2 className="EditManageUru-sectionTitle">Step 3: Record / Activity Details</h2>

              <div className="EditManageUru-grid2">
                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Effort Type</span>
                  <select value={formData.effortType} onChange={(e) => update("effortType", e.target.value)}>
                    <option value="">Select</option>
                    <option value="Individual">Individual</option>
                    <option value="Group">Group</option>
                  </select>
                </label>

                <label className="EditManageUru-field full">
                  <span className="EditManageUru-label">Record / Activity Title</span>
                  <input value={formData.recordTitle} onChange={(e) => update("recordTitle", e.target.value)} />
                </label>

                <label className="EditManageUru-field full">
                  <span className="EditManageUru-label">Record / Activity Description</span>
                  <textarea value={formData.recordDescription} onChange={(e) => update("recordDescription", e.target.value)} />
                </label>

                <label className="EditManageUru-field full">
                  <span className="EditManageUru-label">Purpose of Attempt</span>
                  <textarea value={formData.attemptPurpose} onChange={(e) => update("attemptPurpose", e.target.value)} />
                </label>

                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Date of Attempt</span>
                  <input type="date" value={formData.attemptDate} onChange={(e) => update("attemptDate", e.target.value)} />
                </label>

                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Record / Activity Venue</span>
                  <input value={formData.venue} onChange={(e) => update("venue", e.target.value)} />
                </label>

                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Organisation Name</span>
                  <input value={formData.organisation} onChange={(e) => update("organisation", e.target.value)} />
                </label>
              </div>
            </section>
          )}

          {/* STEP 4 - Social Links */}
          {step === 4 && (
            <section className="EditManageUru-stepSection">
              <h2 className="EditManageUru-sectionTitle">Step 4: Social Media & Links</h2>

              {/* helper to render platform */}
              {(
                [
                  { label: "Instagram", arr: instagram, set: setInstagram },
                  { label: "Facebook", arr: facebook, set: setFacebook },
                  { label: "LinkedIn", arr: linkedin, set: setLinkedin },
                  { label: "X (Twitter)", arr: xLinks, set: setXLinks },
                  { label: "Pinterest", arr: pinterest, set: setPinterest },
                  { label: "Google Drive", arr: gdrive, set: setGdrive },
                  { label: "YouTube", arr: youtube, set: setYoutube },
                  { label: "Other Media", arr: otherMedia, set: setOtherMedia },
                ] as any
              ).map((plat: any) => (
                <div className="EditManageUru-platform" key={plat.label}>
                  <div className="EditManageUru-platformHeader">
                    <strong>{plat.label}</strong>
                    <button type="button" className="EditManageUru-addBtn" onClick={() => addLink(plat.set)}>
                      + Add
                    </button>
                  </div>

                  <div className="EditManageUru-platformList">
                    {plat.arr.length === 0 && <small className="EditManageUru-hint">No links added yet</small>}

                    {plat.arr.map((ln: SocialLink) => (
                      <div className="EditManageUru-linkRow" key={ln.id}>
                        <input
                          placeholder={`Paste ${plat.label} link`}
                          value={ln.url}
                          onChange={(e) => updateLink(plat.arr, plat.set, ln.id, e.target.value)}
                        />
                        <button type="button" className="EditManageUru-removeBtn" onClick={() => removeLink(plat.arr, plat.set, ln.id)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <p className="EditManageUru-hint">You can add multiple links per platform. Recommended 1-4 links.</p>
            </section>
          )}

          {/* STEP 5 - Witness Details */}
          {step === 5 && (
            <section className="EditManageUru-stepSection">
              <h2 className="EditManageUru-sectionTitle">Step 5: Witness Details</h2>

              <div className="EditManageUru-grid2">
                <fieldset className="EditManageUru-fieldset">
                  <legend>Witness 1</legend>
                  <label className="EditManageUru-field">
                    <span className="EditManageUru-label">Name</span>
                    <input value={formData.witness1.name} onChange={(e) => updateWitness("witness1", "name", e.target.value)} />
                  </label>

                  <label className="EditManageUru-field">
                    <span className="EditManageUru-label">Designation</span>
                    <input value={formData.witness1.designation} onChange={(e) => updateWitness("witness1", "designation", e.target.value)} />
                  </label>

                  <label className="EditManageUru-field full">
                    <span className="EditManageUru-label">Address</span>
                    <textarea value={formData.witness1.address} onChange={(e) => updateWitness("witness1", "address", e.target.value)} />
                  </label>

                  <label className="EditManageUru-field">
                    <span className="EditManageUru-label">Mobile Number</span>
                    <input value={formData.witness1.mobile} onChange={(e) => updateWitness("witness1", "mobile", e.target.value)} />
                  </label>

                  <label className="EditManageUru-field">
                    <span className="EditManageUru-label">Email</span>
                    <input value={formData.witness1.email} onChange={(e) => updateWitness("witness1", "email", e.target.value)} />
                  </label>
                </fieldset>

                <fieldset className="EditManageUru-fieldset">
                  <legend>Witness 2</legend>
                  <label className="EditManageUru-field">
                    <span className="EditManageUru-label">Name</span>
                    <input value={formData.witness2.name} onChange={(e) => updateWitness("witness2", "name", e.target.value)} />
                  </label>

                  <label className="EditManageUru-field">
                    <span className="EditManageUru-label">Designation</span>
                    <input value={formData.witness2.designation} onChange={(e) => updateWitness("witness2", "designation", e.target.value)} />
                  </label>

                  <label className="EditManageUru-field full">
                    <span className="EditManageUru-label">Address</span>
                    <textarea value={formData.witness2.address} onChange={(e) => updateWitness("witness2", "address", e.target.value)} />
                  </label>

                  <label className="EditManageUru-field">
                    <span className="EditManageUru-label">Mobile Number</span>
                    <input value={formData.witness2.mobile} onChange={(e) => updateWitness("witness2", "mobile", e.target.value)} />
                  </label>

                  <label className="EditManageUru-field">
                    <span className="EditManageUru-label">Email</span>
                    <input value={formData.witness2.email} onChange={(e) => updateWitness("witness2", "email", e.target.value)} />
                  </label>
                </fieldset>
              </div>
            </section>
          )}

          {/* STEP 6 - Payment & Submit */}
          {step === 6 && (
            <section className="EditManageUru-stepSection">
              <h2 className="EditManageUru-sectionTitle">Step 6: Payment & Submit</h2>

              <div className="EditManageUru-grid2">
                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Payment ID</span>
                  <input value={formData.paymentId} onChange={(e) => update("paymentId", e.target.value)} />
                </label>

                <label className="EditManageUru-field">
                  <span className="EditManageUru-label">Status</span>
                  <select value={formData.paymentStatus} onChange={(e) => update("paymentStatus", e.target.value)}>
                    <option value="">Select</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </select>
                </label>

                <div className="EditManageUru-fullPreview">
                  <h3>Preview</h3>
                  <pre className="EditManageUru-previewBlock">{JSON.stringify({ ...formData, social: { instagram, facebook, linkedin, xLinks, pinterest, gdrive, youtube, otherMedia } }, null, 2)}</pre>
                </div>
              </div>

              <div className="EditManageUru-submitRow">
                <button type="button" className="EditManageUru-btn EditManageUru-cancel" onClick={() => alert("Cancelled")}>Cancel</button>
                <button type="submit" className="EditManageUru-btn EditManageUru-primary">Submit & Save</button>
              </div>
            </section>
          )}

          {/* Navigation */}
          <div className="EditManageUru-nav">
            <button type="button" onClick={prev} disabled={step === 1} className="EditManageUru-navBtn">Prev</button>
            {step < 6 ? (
              <button type="button" onClick={next} className="EditManageUru-navBtn EditManageUru-primary">Next</button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditManageUruForm;

