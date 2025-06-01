const API_URL = 'https://trackademifunction.vercel.app/api/comments';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const commentsManager = {
  /**
   * Get all comments for a plan
   * @param {string} planId - The ID of the plan
   * @returns {Promise<Array>} - Promise that resolves to an array of comments
   */
  getComments: async (planId) => {
    try {
      const response = await fetch(`${API_URL}?planId=${planId}`, {
        method: 'GET',
        mode: 'cors',
        headers: defaultHeaders,
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching comments: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },
  
  /**
   * Add a new comment to a plan
   * @param {Object} comment - The comment to add
   * @returns {Promise<Object>} - Promise that resolves to the created comment
   */
  addComment: async (comment) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        mode: 'cors',
        headers: defaultHeaders,
        credentials: 'omit',
        body: JSON.stringify(comment),
      });
      
      if (!response.ok) {
        throw new Error(`Error adding comment: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },
  
  /**
   * Update a comment
   * @param {string} commentId - The ID of the comment to update
   * @param {Object} updatedComment - The updated comment data
   * @returns {Promise<Object>} - Promise that resolves to the updated comment
   */
  updateComment: async (commentId, updatedComment) => {
    try {
      const response = await fetch(`${API_URL}?id=${commentId}`, {
        method: "PUT",
        mode: 'cors',
        headers: defaultHeaders,
        credentials: 'omit',
        body: JSON.stringify(updatedComment),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating comment: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  },
  
  /**
   * Delete a comment
   * @param {string} commentId - The ID of the comment to delete
   * @returns {Promise<Object>} - Promise that resolves to the operation result
   */
  deleteComment: async (commentId) => {
    try {
      const response = await fetch(`${API_URL}?id=${commentId}`, {
        method: "DELETE",
        mode: 'cors',
        headers: defaultHeaders,
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting comment: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }
};

export default commentsManager; 