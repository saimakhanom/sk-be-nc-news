

  
  export const fetchSortedArticles = (sortBy, order = "asc") => {
    return api
      .get(
        `/articles?sort_by=${sortBy.toLowerCase()}&order=${order.toLowerCase()}`
      )
      .then((res) => {
        return res.data.articles;
      })
      .catch((err) => {
        return err;
      });
  };
  
  export const deleteComment = (comment_id) => {
    return api
      .delete(`/comments/${comment_id}`)
      .then(() => {
        return "Comment deleted";
      })
      .catch((err) => {
        return err;
      });
  };
  
  export const patchCommentVote = (comment_id, body) => {
      // body should contain key of inc_votes with a positive or negative number
      return api
        .patch(`comments/${comment_id}`, body)
        .then((res) => {
          return res.data.comment;
        })
        .catch((err) => {
          return err;
        });
    };