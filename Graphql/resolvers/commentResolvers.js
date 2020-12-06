const { UserInputError, AuthenticationError } = require("apollo-server");
const Post = require("../../models/Post");
const chechAuth = require("../../utils/chechAuth");
const postsResolvers = require("./postsResolvers");
const usersResolvers = require("./usersResolvers");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = chechAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty Comment", {
          errors: {
            body: "Comment must not be empyt",
          },
        });
      }
      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },

    async deleteComment(_, { postId, commentId }, context) {
      const { username } = chechAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);
        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Post not found");
      }
    },

    async likePost(_, { postId }, context) {
      const { username } = chechAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          //post already liked
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          //not liked yet

          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
  },
};
