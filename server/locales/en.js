// @ts-check

export default {
  translation: {
    appName: 'Fastify Boilerplate',
    flash: {
      session: {
        create: {
          success: 'You are logged in',
          error: 'Wrong email or password',
        },
        delete: {
          success: 'You are logged out',
        },
      },
      users: {
        create: {
          error: 'Failed to register',
          success: 'User registered successfully',
        },
        update: {
          success: 'User updated successfully',
          error: 'User updated failed',
          notFound: 'User not found',
          notAvalible: 'You can\'t  update other user',
        },
        delete: {
          success: 'User successfully deleted',
          error: 'User deleted failed',
          notAvalible: 'You can\'t  delete other user',
          isExecutor: 'You can\'t  delete user, he has task',
        },
      },
      statuses: {
        new: 'Создание задачи',
        create: {
          error: 'Failed to create new status',
          success: 'Status created',
        },
        edit: {
          error: 'Failed to edit status',
          success: 'Status edited',
        },
        delete: {
          error: 'Failed to delete status',
          success: 'Status was deleted',
          isExecutor: 'You can\'t  delete status, it\'s assigned to a task',
        },
      },
      labels: {
        new: 'Create label',
        create: {
          error: 'Failed to create new label',
          success: 'Label created',
        },
        edit: {
          error: 'Failed to edit label',
          success: 'Label edited',
        },
        delete: {
          error: 'Failed to delete label',
          success: 'Label was deleted',
          isExecutor: 'You can\'t  delete label, it\'s assigned to a task',
        },
      },
      tasks: {
        create: {
          error: 'Failed to create new task',
          success: 'Task created',
        },
        edit: {
          error: 'Failed to edit task',
          success: 'Task edited',
        },
        delete: {
          error: 'Failed to delete task',
          success: 'Task was deleted',
        },
      },
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        signIn: 'Login',
        signUp: 'Register',
        signOut: 'Logout',
        tasks: 'Tasks',
        statuses: 'Statuses',
        labels: 'Labels',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Login',
          submit: 'Login',
        },
      },
      users: {
        id: 'ID',
        fullName: 'Full Name',
        email: 'Email',
        createdAt: 'Created at',
        actions: 'Actions',
        new: {
          submit: 'Register',
          signUp: 'Register',
        },
      },
      welcome: {
        index: {
          hello: 'Hello from Hexlet!',
          description: 'Online programming school',
          more: 'Learn more',
        },
      },
      statuses: {
        title: 'Statuses',
        new: 'Creating a status',
        edit: {
          title: 'Editing a status',
          btn: 'Edit',
        },
        table: {
          id: 'Id',
          name: 'Name',
          date: 'Create date',
        },
        create: {
          title: 'Create status',
        },
      },
      labels: {
        title: 'Labels',
        new: 'Creating a label',
        edit: {
          title: 'Editing a label',
          btn: 'Edit',
        },
        table: {
          id: 'Id',
          name: 'Name',
          date: 'Create date',
        },
        create: {
          title: 'Create label',
        },
      },
      tasks: {
        create: 'Create task',
        show: 'Show tasks',
        edit: {
          title: 'Editing task',
          btn: 'Edit',
        },
        new: 'Creating a task',
        table: {
          id: 'Id',
          name: 'Name',
          status: 'Status',
          author: 'Author',
          executor: 'Exucuter',
          date: 'Create date',
        },
      },
    },
  },
};
