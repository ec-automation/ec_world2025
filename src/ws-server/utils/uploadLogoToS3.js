export async function uploadLogoToS3(file, companyId) {
    const fileName = `companies/${companyId}/logo.png`;
  
    const formData = new FormData();
    formData.append('file', file);
  
    const uploadUrl = `https://ecworldbucket.s3.amazonaws.com/${fileName}`;
  
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
        'x-amz-acl': 'public-read'
      }
    });
  
    return `https://ecworldbucket.s3.amazonaws.com/${fileName}`;
  }
  