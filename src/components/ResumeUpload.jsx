import { useRef, useState } from 'react'
import { Eye, FileText, RefreshCw, Trash2, Upload } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Alert, LoadingState } from './Feedback'
import { ConfirmDialog } from './Modal'
import {
  MAX_RESUME_BYTES,
  RESUME_EXTENSIONS,
  fileExtension,
  fileToDataUrl,
  formatDate,
  openStoredFile,
} from '../utils/helpers'

// Upload / view / replace / remove. The file is kept in localStorage as a
// data URL, which is why the size limit is small.
export default function ResumeUpload() {
  const { resume, saveResume, removeResume } = useApp()
  const inputRef = useRef(null)
  const [message, setMessage] = useState(null)
  const [busy, setBusy] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState(false)

  const onFile = async (event) => {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return
    if (!RESUME_EXTENSIONS.includes(fileExtension(file.name))) {
      setMessage({ type: 'error', text: 'Invalid file type. Please upload a PDF, DOC or DOCX file.' })
      return
    }
    if (file.size > MAX_RESUME_BYTES) {
      setMessage({ type: 'error', text: 'This file is too large. The maximum resume size is 2 MB.' })
      return
    }
    setBusy(true)
    try {
      const dataUrl = await fileToDataUrl(file)
      const saved = saveResume({
        fileName: file.name,
        fileType: file.type || fileExtension(file.name),
        uploadedAt: new Date().toISOString(),
        dataUrl,
      })
      setMessage(
        saved
          ? { type: 'success', text: `${file.name} has been uploaded.` }
          : { type: 'error', text: 'Could not store this file. Browser storage is full — try a smaller file.' },
      )
    } catch {
      setMessage({ type: 'error', text: 'The file could not be read. Please try again.' })
    } finally {
      setBusy(false)
    }
  }

  const pickFile = () => inputRef.current.click()

  return (
    <div className="card resume-card">
      <h2 className="card-title">Resume</h2>
      {message && <Alert type={message.type}>{message.text}</Alert>}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="sr-only"
        onChange={onFile}
        tabIndex={-1}
        aria-hidden="true"
      />

      {busy ? (
        <LoadingState label="Reading file…" />
      ) : resume ? (
        <>
          <div className="resume-file">
            <FileText size={22} />
            <div>
              <p className="resume-name">{resume.fileName}</p>
              <p className="muted small">Uploaded on {formatDate(resume.uploadedAt)}</p>
            </div>
          </div>
          <div className="btn-row">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => openStoredFile(resume)}>
              <Eye size={15} /> View Resume
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={pickFile}>
              <RefreshCw size={15} /> Replace Resume
            </button>
            <button type="button" className="btn btn-outline btn-sm danger-text" onClick={() => setConfirmRemove(true)}>
              <Trash2 size={15} /> Remove Resume
            </button>
          </div>
          {fileExtension(resume.fileName) !== 'pdf' && (
            <p className="hint">Word documents cannot be previewed in the browser, so View Resume downloads the file.</p>
          )}
        </>
      ) : (
        <div className="resume-empty">
          <p>No resume uploaded yet.</p>
          <p className="muted small">Upload your resume to make applying easier.</p>
          <button type="button" className="btn btn-primary" onClick={pickFile}>
            <Upload size={16} /> Upload Resume
          </button>
        </div>
      )}
      <p className="hint">Accepted formats: PDF, DOC, DOCX. Maximum size 2 MB.</p>

      {confirmRemove && (
        <ConfirmDialog
          title="Remove resume"
          message="Your resume will be removed from this browser. You will need to upload one again before applying."
          confirmLabel="Remove"
          danger
          onCancel={() => setConfirmRemove(false)}
          onConfirm={() => {
            removeResume()
            setConfirmRemove(false)
            setMessage({ type: 'info', text: 'Your resume has been removed.' })
          }}
        />
      )}
    </div>
  )
}
