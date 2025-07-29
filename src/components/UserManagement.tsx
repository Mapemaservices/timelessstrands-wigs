import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, Users, Shield, ShieldCheck, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  email_confirmed_at: string;
  is_admin: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingUsers, setProcessingUsers] = useState<Set<string>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUserForm, setNewUserForm] = useState({ email: '', password: '', displayName: '' });
  const [editUserForm, setEditUserForm] = useState({ email: '', displayName: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Use the new function to get all users with admin status
      const { data: allUsers, error } = await supabase.rpc('get_all_users');

      if (error) throw error;

      setUsers(allUsers || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    if (!newUserForm.email || !newUserForm.password) {
      toast.error('Email and password are required');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`https://bnahhzscrpbgbeaebvtt.supabase.co/functions/v1/admin-user-management`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createUser',
          userData: {
            email: newUserForm.email,
            password: newUserForm.password,
            displayName: newUserForm.displayName
          }
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create user');
      }
      
      toast.success(`User ${newUserForm.email} created successfully`);
      setNewUserForm({ email: '', password: '', displayName: '' });
      setIsCreateDialogOpen(false);
      await fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    }
  };

  const updateUser = async () => {
    if (!editingUser || !editUserForm.email) {
      toast.error('Email is required');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`https://bnahhzscrpbgbeaebvtt.supabase.co/functions/v1/admin-user-management`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateUser',
          userData: {
            userId: editingUser.id,
            email: editUserForm.email,
            displayName: editUserForm.displayName
          }
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update user');
      }
      
      toast.success(`User updated successfully`);
      setEditingUser(null);
      setEditUserForm({ email: '', displayName: '' });
      setIsEditDialogOpen(false);
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const deleteUser = async (userId: string, email: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`https://bnahhzscrpbgbeaebvtt.supabase.co/functions/v1/admin-user-management`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteUser',
          userData: {
            userId
          }
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete user');
      }
      
      toast.success(`User ${email} deleted successfully`);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const toggleAdminStatus = async (userId: string, email: string, currentStatus: boolean) => {
    if (processingUsers.has(userId)) return;

    setProcessingUsers(prev => new Set(prev).add(userId));
    
    try {
      if (currentStatus) {
        // Remove admin
        const { error } = await supabase
          .from('admin_roles')
          .update({ is_admin: false })
          .eq('user_id', userId);

        if (error) throw error;
        toast.success(`Removed admin access from ${email}`);
      } else {
        // Make admin using our function
        const { error } = await supabase.rpc('add_admin_by_email', {
          admin_email: email
        });

        if (error) throw error;
        toast.success(`Granted admin access to ${email}`);
      }

      await fetchUsers();
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast.error('Failed to update admin status');
    } finally {
      setProcessingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setEditUserForm({
      email: user.email,
      displayName: '' // We don't have display name in the user data currently
    });
    setIsEditDialogOpen(true);
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading users...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <Label htmlFor="displayName">Display Name (Optional)</Label>
                  <Input
                    id="displayName"
                    value={newUserForm.displayName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, displayName: e.target.value })}
                    placeholder="Enter display name"
                  />
                </div>
                <Button onClick={createUser} className="w-full">
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-2">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {searchTerm ? 'No users found matching your search.' : 'No users found.'}
            </p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{user.email}</span>
                    {user.is_admin && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        Admin
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>User ID: {user.id}</p>
                    <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                    {user.last_sign_in_at && (
                      <p>Last login: {new Date(user.last_sign_in_at).toLocaleDateString()}</p>
                    )}
                    {!user.email_confirmed_at && (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        Email not verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {user.email}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteUser(user.id, user.email)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button
                    variant={user.is_admin ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleAdminStatus(user.id, user.email, user.is_admin || false)}
                    disabled={processingUsers.has(user.id)}
                    className="min-w-[120px]"
                  >
                    {processingUsers.has(user.id) ? (
                      'Processing...'
                    ) : user.is_admin ? (
                      <>
                        <Shield className="h-4 w-4 mr-1" />
                        Remove Admin
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4 mr-1" />
                        Make Admin
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-sm text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
          <p className="font-medium mb-1">User Management:</p>
          <p>• Create new users with email and password</p>
          <p>• Edit user details using the edit button</p>
          <p>• Delete users with the trash button (permanent action)</p>
          <p>• Toggle admin privileges as needed</p>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editUserForm.email}
                  onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <Label htmlFor="editDisplayName">Display Name</Label>
                <Input
                  id="editDisplayName"
                  value={editUserForm.displayName}
                  onChange={(e) => setEditUserForm({ ...editUserForm, displayName: e.target.value })}
                  placeholder="Enter display name"
                />
              </div>
              <Button onClick={updateUser} className="w-full">
                Update User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserManagement;