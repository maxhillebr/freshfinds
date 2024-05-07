export const copyToClipboard = async (username, list, id) => {
  try {
    const url = `https://${window.location.host}/users/${username}/${list}/${id}`;

    const shareData = {
      title: "Guck dir das mal auf freshfinds an!",
      text: "Hier der Link:",
      url: url,
    };

    if (navigator.share) {
      await navigator.share(shareData);
      console.log("Shared successfully");
    } else {
      // Fallback if Share API is not supported
      await navigator.clipboard.writeText(url);
      alert("Kopiert!");
    }
  } catch (err) {
    console.error("Failed to share or copy: ", err);
    alert("Kopieren fehlgeschlagen!");
  }
};
