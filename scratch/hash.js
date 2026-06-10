import crypto from 'crypto';

const files = {
  GCU: "Government College University, Lahore - Clock tower and main building.jpg",
  LUMS: "Lahore University of Management Sciences Hostels.jpg",
  PU: "Punjab University old campus.jpg",
  QAU: "Quaid-i-Azam University.jpg",
  AKU: "Aga Khan University Hospital, Karachi.jpg",
  COMSATS: "COMSATS Islamabad.jpg",
  UET: "UET Lahore Main Block.jpg",
  KU: "University of Karachi campus.jpg",
  IBA: "IBA Karachi main campus.jpg",
  GIKI: "GIKI Clock Tower.jpg",
  BU: "Bahria University Islamabad campus.jpg",
  IIUI: "Faisal Mosque Islamabad Pakistan.jpg", // IIUI is near Faisal Mosque and often depicted with it
  UAF: "University of Agriculture, Faisalabad main building.jpg",
  MUET: "Mehran University Main Entrance.jpg"
};

function getUrl(fileName) {
  const cleanName = fileName.replace(/\s+/g, '_');
  const hash = crypto.createHash('md5').update(cleanName).digest('hex');
  const a = hash[0];
  const ab = hash.slice(0, 2);
  const encodedName = encodeURIComponent(cleanName).replace(/'/g, "%27");
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${a}/${ab}/${encodedName}/960px-${encodedName}`;
}

for (const [key, val] of Object.entries(files)) {
  console.log(`${key}: ${getUrl(val)}`);
}
