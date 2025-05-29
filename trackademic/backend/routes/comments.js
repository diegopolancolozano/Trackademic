const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Obtener comentarios de un plan
router.get('/:planId', async (req, res) => {
  try {
    const comments = await Comment.find({ planId: req.params.planId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear un nuevo comentario
router.post('/', async (req, res) => {
  const comment = new Comment({
    planId: req.body.planId,
    userId: req.body.userId,
    userName: req.body.userName,
    content: req.body.content
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un comentario
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    
    // Verificar que el usuario sea el dueño del comentario
    if (comment.userId !== req.body.userId) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await comment.remove();
    res.json({ message: 'Comentario eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 