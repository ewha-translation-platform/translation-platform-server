# Translation Platform - Server

## Error Handling

**example**

```js
import { NotFound } from "http-errors";

function handler(){
    ...
    throw new NotFound("user not found");
}
```

## File Structure

The file structure is highly inspired by [Nest.js](https://nestjs.com)

```
route
+-- dto
+-- entities
+-- route.controller.ts
+-- route.service.ts
...

```

- dto
- entities
- controller
- service

## Required Stack

- Typescript
- [Fastify](https://fastify.io)
- [TypeBox](https://github.com/sinclairzx81/typebox)
- [Prisma ORM](https://prisma.io)
- MySQL

## Conventions

### 1. Commit Messages

```
[type] message
```

**commit types**

- [feat]: 새로운 기능을 추가 / 변경
- [fix]: 버그 수정
- [refactor]: 코드 리팩토링
- [style]: 코드 스타일 변경(동작에 영향을 주는 코드 변경 없음)
- [test]: 테스트 코드에 대한 모든 변경사항
- [docs]: 문서 수정
- [chore]: 기타 사항

**example**

```
[feat] add auth router
[docs] create README.md
```

### 2. Database

The field name in Prisma schema follows **camelCase**.  
The model name in Prisma schema follows **PascalCase**.  
The table name and column name in the database follow **snake_case**.

```prisma
model User {
    firstName String @map("first_name")
    ...

    @@map("user")
}
```
