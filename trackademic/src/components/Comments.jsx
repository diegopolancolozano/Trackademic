import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  Stack,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '../services/supabaseClient';

const API_URL = 'http://localhost:5000'; // URL del backend

export default function Comments({ planId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    fetchComments();
  }, [planId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/comments/${planId}`);
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Error al cargar los comentarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId: currentUser.id,
          userName: currentUser.user_metadata?.full_name || 'Usuario',
          content: newComment.trim()
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      setNewComment('');
      await fetchComments();
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Error al agregar el comentario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      await fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Error al eliminar el comentario');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
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
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting || !currentUser}
            multiline
            rows={2}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!newComment.trim() || submitting || !currentUser}
            endIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
          >
            Enviar
          </Button>
        </Stack>
      </Box>

      <Stack spacing={2}>
        {comments.map((comment) => (
          <Paper key={comment._id} sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="start">
              <Avatar>
                {comment.userName[0]}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {comment.userName}
                  </Typography>
                  {currentUser && currentUser.id === comment.userId && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(comment._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {new Date(comment.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
                <Typography variant="body1">
                  {comment.content}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
        {comments.length === 0 && (
          <Typography color="text.secondary" align="center">
            No hay comentarios aún. ¡Sé el primero en comentar!
          </Typography>
        )}
      </Stack>
    </Box>
  );
} 