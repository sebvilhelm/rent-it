async function uploadImage(event) {
  console.log('Uploading image...')
  const {
    files: [file],
  } = event.target

  const data = new FormData()
  data.append('file', file)
  data.append('upload_preset', 'bachelor-project')

  const res = await fetch(
    'https://api.cloudinary.com/v1_1/vilhelmnielsen/image/upload',
    { method: 'POST', body: data }
  )

  console.log('Upload complete')

  return await res.json()
}

export default uploadImage
