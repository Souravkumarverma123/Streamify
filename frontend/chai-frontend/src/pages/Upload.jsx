import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { videoAPI } from '../api/video'
import {
  Upload as UploadIcon,
  Video,
  Image,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react'

const Upload = () => {
  const navigate = useNavigate()
  const [uploadStep, setUploadStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoFile: null,
    thumbnail: null
  })
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        [type]: file
      }))
    }
  }

  const removeFile = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: null
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      // Create FormData for file upload
      const uploadFormData = new FormData()
      uploadFormData.append('title', formData.title)
      uploadFormData.append('description', formData.description)
      uploadFormData.append('videoFile', formData.videoFile)
      if (formData.thumbnail) {
        uploadFormData.append('thumbnail', formData.thumbnail)
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      // Upload to backend
      const response = await videoAPI.uploadVideo(uploadFormData)

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Wait a bit for progress bar to complete
      await new Promise(resolve => setTimeout(resolve, 500))

      setUploading(false)
      setUploadStep(3)

    } catch (error) {
      console.error('Upload failed:', error)
      setUploading(false)
      alert('Upload failed: ' + (error.response?.data?.message || error.message))
    }
  }

  const steps = [
    { number: 1, title: 'Upload Video', description: 'Select your video file' },
    { number: 2, title: 'Details', description: 'Add title and description' },
    { number: 3, title: 'Complete', description: 'Video uploaded successfully' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Upload Video
          </h1>
          <p className="text-muted-foreground mt-2">
            Share your content with the world
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${uploadStep >= step.number
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-gray-300 text-gray-400'
                  }`}>
                  {uploadStep > step.number ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{step.number}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-sm">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${uploadStep > step.number ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upload Form */}
        <div className="max-w-4xl mx-auto">
          {uploadStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Upload Video File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Video Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Video File</label>
                    {!formData.videoFile ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleFileChange(e, 'videoFile')}
                          className="hidden"
                          id="video-upload"
                        />
                        <label htmlFor="video-upload" className="cursor-pointer">
                          <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-lg font-medium">Click to upload video</p>
                          <p className="text-sm text-muted-foreground">or drag and drop</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            MP4, MOV, AVI up to 2GB
                          </p>
                        </label>
                      </div>
                    ) : (
                      <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Video className="w-8 h-8 text-green-600" />
                            <div>
                              <p className="font-medium">{formData.videoFile.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(formData.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile('videoFile')}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Thumbnail *</label>
                    {!formData.thumbnail ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'thumbnail')}
                          className="hidden"
                          id="thumbnail-upload"
                        />
                        <label htmlFor="thumbnail-upload" className="cursor-pointer">
                          <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="font-medium">Upload thumbnail</p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG up to 5MB
                          </p>
                        </label>
                      </div>
                    ) : (
                      <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Image className="w-8 h-8 text-green-600" />
                            <div>
                              <p className="font-medium">{formData.thumbnail.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(formData.thumbnail.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile('thumbnail')}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => setUploadStep(2)}
                      disabled={!formData.videoFile || !formData.thumbnail}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {uploadStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Video Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter video title"
                      required
                      className="text-lg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.title.length}/100 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your video..."
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.description.length}/5000 characters
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setUploadStep(1)}
                    >
                      Previous
                    </Button>
                    <Button
                      type="submit"
                      disabled={!formData.title || uploading}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <UploadIcon className="w-4 h-4 mr-2" />
                          Upload Video
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {uploadStep === 3 && (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Video Uploaded Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  Your video is now being processed and will be available shortly.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    Back to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setUploadStep(1)
                      setFormData({
                        title: '',
                        description: '',
                        videoFile: null,
                        thumbnail: null
                      })
                    }}
                  >
                    Upload Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Progress */}
          {uploading && (
            <Card className="mt-6">
              <CardContent className="py-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span className="font-medium">Uploading your video...</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {uploadProgress}% complete
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Upload
