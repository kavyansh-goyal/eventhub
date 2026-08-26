import QRCode from "qrcode";

// Encodes the ticketId into a QR code and returns a base64 data URL
export const generateQRCode = async (ticketId) => {
  try {
    const dataUrl = await QRCode.toDataURL(ticketId, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 300,
    });
    return dataUrl;
  } catch (err) {
    throw new Error("Failed to generate QR code: " + err.message);
  }
};
