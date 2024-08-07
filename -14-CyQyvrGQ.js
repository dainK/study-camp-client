const A="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAAEACAYAAADShCNfAAAAAXNSR0IArs4c6QAACNtJREFUeJzt3LFrW0keB/Bx8Fa+4ggEUgjVWQJihfMHLFsd19ypuEYIV0sgcPWVKVxscXUgROw2IWxrAuZItWyRMlpBwGBSmlcEDMbFlYK5IveELMuR9CRr3lifD6iQMk/+zXdmnkZPUkIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgFXspC4gtWajESfv7z+4H46GH6/l0mm34uD84spjZ0Wx9fmtSv4sY3K+mCubV7f8V37SXE9AZd031TvPZH/q0I+S/Dcrt/zrdgJaVqfdisvOl7rMlRDkX5d+hGajEZuNRuy0W3F+6+s67VYsn2PdtW0D+aeVa/5V6jVX1kf+rM3kxFh0YlU5htnkTxXmSlp1yv/eKgfnfAKafps+OL8Y76oPD3pX6jo86I1rnj4mdR/kL/9l5VTrLDnOlUnyr4HJcKdvX+vU9C11py6LIo763Xjc2ovHrb046ndn1jPd5rIoktYtf/lXlVOts+Q2V6bJv0ZyPQGF8GWyrFL/9ORLQf5p5Zh/TrVOy3mulOS/PrurHLxqUYcHvfj89Ztk30p5/vrNzvDk9Esfvvk2tB8/Cn+8n932p/f3QviuE4Ynp+GXV59CePX3cDT4kPQbNfKX/7JG/W589+Lt0selniulf7z6lOVcKcl/vVZ+0s7+k/Eibj9+FEL4cmKablcu9uHJ6fixukyqnMk/rdzyL+vNoda7SP4AgP+J4yYvmw/HO+tnZ5/ltGHyZ1HmSlop87+1P2ZSpSX/tHLKP6da7yL5AwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5GkndQHcjmajESfv7z+4H46GH6+Nd6fdioPzi/H9s6IwJ9ZA/nD7ll4skwtz0UUZQn4LM9cTUFn3TfV+Tafdissec1vkn1au+cNXddqtOL/V9WOajUacXhR1VNZZtZ+3UdM2kX9a8geSmtwwLHpScfJZH/nDZtyrctAyi3KVHV0qOZ+Api/pDM4vxrvqw4PelRoPD3rjfk5f8k1J/mnlnD/MVU7ueYty+pbDJJ9cvNO3eX1NVfMsl0URR/1uPG7txePWXhz1uzPrm2yz6RpnkX9adyV/uNEyi3LU78bLoshucud6Agrhy4mlSv03tUlB/mnlnD/bY3fZA0b9bnz34u3Sf+jwoBefv36TxTeUpneaixr1u3H36a/J+/j89Zud4cnplz58821oP34U/ng/u+1P7++F8F0nDE9Owy+vPm2wypvJP63c82d7LD3ZOvtPYgghtB8/CiF8WazTbcoFMDw5HT92NPiQ1cQu+xnCcn3NrZ91Jf+05A8AcEvslrbMy+bD8c762dln479h8of1WcsC2qZFuU19rSP5pyV/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAICM7aQugO3WbDTi5P39B/fD0fDjtXnZabfi4PziymNnRWH+roExSEf2kKFmoxGbjUbstFtxfuvrOu1WLJ9j3bVtC2OQjuzXwyt4huza6sNYpGcM0pA7S7lru7bJehbtU5VjbsNdGQtjkG4Mcs2+Trl7FSSJWbuy0o8/fB+ev34znpuHB73482+/z2x7066P+YxBOrJnK+W6a7vJZVHEUb8bj1t78bi1F0f97sz6pttcFkXyftyVsTAG6eSafV1yv7eOJ2Ezpndtg/OL8dv5w4PelQlxeNAbT5bpY1Iv2tJ0zZs+fhV3ZSyMQboxyDX7OuXurWeGLosi/uk//wrvXrwNIYTwl3/+Lew+/fXaWI763TjZ5r9//Xf4c6NRqzHv7D8ZT+L240chhHDl8kmpXBjDk9PxY0eDD8n7chfGwhikk3P2dch9dx1PwuasY9c2a4GkMrkIjwYfbmxXp5pLd2UsjEG6fuWafV1yr1UoLCbnXdtdYyzSMwZp1CF3g0ctvWw+HC+OZ2efzdMEjEE6sgeAO8wr+x1i11YfxiI9Y5CG3AEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACA/OykLiC1ZqMRJ+/vP7gfjoYfr+XSabfi4PziymNnRbHx/CbrrXutq6g6Lrn1E2BpzUYjNhuN2Gm34vzW13XarVg+x7prm/d3qxyTotYqVhmXqmMJAABswuQ7k0V371WOWbecaq2i6rjcdl1AvWzt5wWzPicq/fjD9+H56zfjbA4PevHn336f2famz2Zu0+SlwLrXuqxVxsXnX8DCyl3yvN3y5I66bp/FXBZFHPW78bi1F49be3HU786sbbrNZVEk60NOtVZVZVw2XSOQ1r0qB5UvQvsP7oezotgpbzft7o+GH3cm2+0/uB/q8EJ2eNBb6e+venwVN53I50lRa1VVa62aDZCnrb/k0tl/Mj7ptR8/CiGEK5epSuVJdXhyOn7saPBh4/mV9eZQ6yqqjktu/UzNz0jqyc9IblmuX4AA/IykrvyMZDmVXq1z/gIEAGT5BYhFvWw+jOUtdS3z5FTrqrapr7ct16soOdVahZ+RLK7SlzhCyPMLEMt4dvZ5p7ylrmWenGpd1Tb19TZNX0UZnF+ML19Nr83Dg974hDp9TIoTZ061Lmsd48KCOvtPYnk7POhdC7hU/ttk+03XClyX41WUnGqtys9IFrO7ysGT3/g6Gny4sd2sb48Baa3jKsqm1/ao343vXrxd+rgUtVa1ys9Idp/+mkUf12WrOgtc5Wck9eRnJIu5lc5OfsDuswoAAID/8+4IuCanqyg51bqqbeorAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwDb7H+JLShqlXDgvAAAAAElFTkSuQmCC";export{A as default};