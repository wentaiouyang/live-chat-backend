const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Live Chat Backend API',
    version: '1.0.0',
    description: 'API documentation for the live chat backend.',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string' },
        },
      },
      FriendRequest: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          from: { $ref: '#/components/schemas/User' },
          to: { $ref: '#/components/schemas/User' },
          status: { type: 'string', enum: ['pending', 'accepted', 'rejected'] },
        },
      },
      Chat: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['direct', 'group'] },
          name: { type: 'string' },
          participants: {
            type: 'array',
            items: { $ref: '#/components/schemas/User' },
          },
        },
      },
      Message: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          chat: { type: 'string' },
          sender: { $ref: '#/components/schemas/User' },
          content: { type: 'string' },
          type: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/auth/signin': {
      post: {
        summary: 'Sign in',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Signed in',
          },
        },
      },
    },
    '/auth/signup': {
      post: {
        summary: 'Sign up',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  username: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
                required: ['username', 'email', 'password'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Signed up' },
        },
      },
    },
    '/user/list': {
      get: {
        summary: 'List users',
        tags: ['Users'],
        responses: {
          200: {
            description: 'List of users',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
      },
    },
    '/user/search': {
      get: {
        summary: 'Search users',
        tags: ['Users'],
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'Search keyword',
          },
        ],
        responses: {
          200: {
            description: 'List of matched users',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
      },
    },
    '/user/search/{id}': {
      get: {
        summary: 'Find user by id',
        tags: ['Users'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'User found' },
          404: { description: 'User not found' },
        },
      },
    },
    '/user/update/{id}': {
      put: {
        summary: 'Update user',
        tags: ['Users'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                additionalProperties: true,
              },
            },
          },
        },
        responses: {
          200: { description: 'User updated' },
        },
      },
    },
    '/friends/requests': {
      post: {
        summary: 'Create friend request',
        tags: ['Friends'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  toUserId: { type: 'string' },
                },
                required: ['toUserId'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Friend request created' },
        },
      },
      get: {
        summary: 'List friend requests',
        tags: ['Friends'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'List of friend requests',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/FriendRequest' },
                },
              },
            },
          },
        },
      },
    },
    '/friends/requests/{id}/accept': {
      post: {
        summary: 'Accept friend request',
        tags: ['Friends'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Friend request accepted' },
        },
      },
    },
    '/friends/requests/{id}/reject': {
      post: {
        summary: 'Reject friend request',
        tags: ['Friends'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Friend request rejected' },
        },
      },
    },
    '/friends': {
      get: {
        summary: 'List friends',
        tags: ['Friends'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'List of friends',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
      },
    },
    '/chats': {
      post: {
        summary: 'Create chat',
        tags: ['Chats'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['direct', 'group'] },
                  participantId: { type: 'string' },
                  participantIds: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Chat created' },
        },
      },
      get: {
        summary: 'List chats',
        tags: ['Chats'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'List of chats',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Chat' },
                },
              },
            },
          },
        },
      },
    },
    '/chats/{chatId}': {
      get: {
        summary: 'Get chat',
        tags: ['Chats'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'chatId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Chat detail' },
        },
      },
      patch: {
        summary: 'Update chat',
        tags: ['Chats'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'chatId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  addParticipants: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  removeParticipants: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Chat updated' },
        },
      },
    },
    '/chats/{chatId}/messages': {
      get: {
        summary: 'List messages',
        tags: ['Messages'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'chatId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'before',
            in: 'query',
            required: false,
            schema: { type: 'string', format: 'date-time' },
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 20 },
          },
        ],
        responses: {
          200: {
            description: 'List of messages',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Message' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create message',
        tags: ['Messages'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'chatId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  content: { type: 'string' },
                  type: { type: 'string', default: 'text' },
                },
                required: ['content'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Message created' },
        },
      },
    },
    '/chats/{chatId}/messages/{messageId}/read': {
      post: {
        summary: 'Mark message as read',
        tags: ['Messages'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'chatId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'messageId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Message marked as read' },
        },
      },
    },
  },
};

export default swaggerDocument;


