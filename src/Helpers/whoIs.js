const whoIs = () => {
  window.bacnet.whoIs((data) => {
    return data;
  });
};

export default whoIs;
