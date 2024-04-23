export const copyToClipboard = async (username, list, id) => {
  try {
    const url = `https://${window.location.host}/users/${username}/${list}/${id}`;

    const shareData = {
      title: "Check out this recipe!",
      text: "View this recipe:",
      url: url,
    };

    if (navigator.share) {
      await navigator.share(shareData);
      console.log("Shared successfully");
    } else {
      // Fallback if Share API is not supported
      await navigator.clipboard.writeText(url);
      alert("Copied to clipboard!");
    }
  } catch (err) {
    console.error("Failed to share or copy: ", err);
    alert("Failed to share or copy to clipboard");
  }
};
