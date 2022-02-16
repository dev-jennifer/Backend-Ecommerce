function deleting(value) {
  fetch(`/productos/${value}`, { method: "DELETE", data: { buttonId: value } })
    .then(function (response) {
      if (response.ok) {
        console.log("Delete was recorded");
        return;
      }
      throw new Error("Request failed.");
    })
    .catch(function (error) {
      console.log(error);
    });
}
