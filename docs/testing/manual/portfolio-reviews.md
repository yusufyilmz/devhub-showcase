# Portfolio referral reviews

**Scope and status.** The original portfolio’s moderation queue lives at
`/{username}/review`. Original portfolio referral records share the original queue.
The route uses the original portfolio’s existing authorization.

**Prerequisites.** Use a disposable environment with an original portfolio
owner and one pending referral. Use a separate signed-out session.

| Step | Clickable URL                                                        | Route path             | Action                                          | Expected result                                                       | Actual result or evidence                                          |
| ---- | -------------------------------------------------------------------- | ---------------------- | ----------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1    | [Reviews redirect](http://localhost:3100/reviews)                    | `/reviews`             | Open as the confirmed original portfolio owner. | The link redirects to the current username’s review route.            | Covered by the route test.                                         |
| 2    | [Portfolio reviews](http://localhost:3100/yusufyilmz/review)         | `/yusufyilmz/review`   | Open as the owner, then repeat signed out.      | The owner sees pending reviews. The signed-out session goes to login. | Covered with an owner fixture and a denied session in route tests. |
| 3    | [Another portfolio’s URL](http://localhost:3100/someone-else/review) | `/someone-else/review` | Open while signed in as the original owner.     | The route returns 404 before loading reviews.                         | Covered by the route test.                                         |

Return to the [manual testing index](index.md).
