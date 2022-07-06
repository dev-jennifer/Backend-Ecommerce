function CartDTO(id,items, buyerID,total, timestamps) {
  return {
    id,
    items,
    buyerID,
    total,
    timestamps,
  };
}
module.exports = CartDTO;
