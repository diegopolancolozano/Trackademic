import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { supabase } from '../services/supabaseClient';
import commentsManager from '../services/commentsManager';

export default function Comments({ planId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user on component mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetchComments();
  }, [planId]);

  const fetchComments = async () => {
    try {
      const fetchedComments = await commentsManager.getComments(planId);
      setComments(fetchedComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Error al cargar los comentarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }

      const commentData = {
        planId,
        userId: currentUser.id,
        userName: currentUser.email.split('@')[0],
        content: newComment.trim()
      };

      await commentsManager.addComment(commentData);
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Error al agregar el comentario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment);
    setEditedContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim() || submitting) return;

    setSubmitting(true);
    try {
      await commentsManager.updateComment(editingComment._id, {
        content: editedContent.trim()
      });
      setEditingComment(null);
      fetchComments();
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('Error al actualizar el comentario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (comment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setSubmitting(true);
    try {
      await commentsManager.deleteComment(commentToDelete._id);
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Error al eliminar el comentario');
    } finally {
      setSubmitting(false);
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Comentarios
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="Escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          error={newComment.length > 1000}
          helperText={newComment.length > 1000 ? 'El comentario no puede exceder 1000 caracteres' : ''}
          disabled={submitting}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 1 }}
          disabled={!newComment.trim() || newComment.length > 1000 || submitting}
        >
          {submitting ? <CircularProgress size={24} /> : 'Comentar'}
        </Button>
      </Box>

      {comments.map((comment) => (
        <Paper key={comment._id} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ mr: 1 }}>
              {comment.userName ? comment.userName[0].toUpperCase() : '?'}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">{comment.userName}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(comment.createdAt).toLocaleString()}
                {comment.isEdited && ' (editado)'}
              </Typography>
            </Box>
            {comment.userId === currentUser?.id && (
              <Box>
                <IconButton size="small" onClick={() => handleEdit(comment)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(comment)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
          
          {editingComment?._id === comment._id ? (
            <Box>
              <TextField
                fullWidth
                multiline
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                error={editedContent.length > 1000}
                helperText={editedContent.length > 1000 ? 'El comentario no puede exceder 1000 caracteres' : ''}
                disabled={submitting}
              />
              <Box sx={{ mt: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleSaveEdit}
                  disabled={!editedContent.trim() || editedContent.length > 1000 || submitting}
                  sx={{ mr: 1 }}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Guardar'}
                </Button>
                <Button onClick={() => setEditingComment(null)}>
                  Cancelar
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography>{comment.content}</Typography>
          )}
        </Paper>
      ))}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar este comentario?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 