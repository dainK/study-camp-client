const A="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAAEACAYAAADShCNfAAAAAXNSR0IArs4c6QAADE9JREFUeJzt201rW1caAOBXxoHayDjEzGDtNU4IJn8gxcsUUjJkF7SNoYt2067mH8w23TSLQgKzMtkMoQXDdOlm/oAJJmO0nEGmRcJGwi7UyLOwrEr2tSNLtu+90vOA8P04St7zHt1zzj26igAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJg4hbQDAG5GubzU3X5Quh2Lc5/Eo7ulePriTXy9PBfbh8Votqej1p45895qdfsmQ03Uif/oZL9a3S68/eZZN/5v3zejXF46SnhrIUPxR4T8X5Xpa/lXc+J0g/ToS/ig5bgc+U/FUUTEZm03/vnzduHR3WfdE+sfaud2QDcV3AAKEccDwKOllb4Tj++Votk+KCQNABki/1dopAFsTDqgQT8cWfoQRYT8py2n+c9UBzSszdpubNYiXq5vRER0Zv+llKMaiPxfoau4A8ttBzQm5D9ducx/VjqgIXQnApVGvVDpObHWqMfanYWkiUKE/F+VTOV/6jr+0Rw5SnpVGvXYiui+Ko36uWVTiHmcyP/Ny22eH7aaffuVRr0cEeWIeB4R5c7+GcsH+1kavOT/Co16B5aY2CyMzIP4bG+38K/522fiqjTqzzubGxGxUjmOP/H91WuO8SPk/5pj/Ihc5f9hqxn/Ls5193s6nJWI2Dgvz8sH+2nnOSKO4//bTm311OHedbiVH6rbq9H53HSObbwrFuPtjUR4Mfm/eiNdPF/96c+R1AF1KhHRU5G/lpdenS732d5u4btffxklhJFsHc8eInqSfdnt+xGpfbbkX/4v4/tiMT5ttZ73HBoox++KxeoXrdYNRXm+reM/fZObAbYjIqr3rz+8j5L/qzfSAJb3DqgT/9CxR0RkIP4I+U9F3vKfxQ7oMrZO7d9aXIzp+fmYmp2N9v5+HO7txe87O4nvzVD88n+FrmIAy3MHlCgLDTMI+Zf/y8hiBzSK+upqRMSPPYeeLLw6c6ObGfJ/9UYdwBKNY8NERGTt4pD/dOU9/1nogCaZ/I/uWr5AzksHNK7kP13yDwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOOvkHYAXI9yeenMsdLUQcxNHcbSdCu+fd+Mt988i5/+U4ud5m+xWdvtlqtWt28y1LEk/3D9pi/7hpML80HpdizOfRKP7pbi6Ys38fXyXGwfFqPZno5ae+bM+/J2UY5JB3TUu1Nrz8TP29uFpeW57rGX6xtRLi/1lsvEpEb+0zUm+WfMTQ3xnqOIONqs7R69XN/oO7H+oRa19szRSZmeV1711aPWnjla/1DrK/ByfSM2a7tZrWuh91WaOig8vlfqK/Dl45V4ULrdWy5L5D9dec8/Y+7Sd2DRucgelG7Ho6WVvhOP75Wi2T4oJN2B5VRfh1KaOoile6WIaHWPffl4JXaavxV6Z6BZVWvPRK19PNGIiHj64k3iTDtD5D9dY5V/xs+lZ3ynL7je5YKLLsa8LSsMWpekclmo66llqa5Ko16oNOrd/bU7C7F2Z6FvCSsj8Z97Tv6vX97zz2QYegkxIo4qjXpsRXRfnQszaQkxj0sLifUYoM6ZsHywnzg5qTTq5YgoR8TziCh39rsetpo3EN1A5D9duc4/k2GYJcSunotvJSI2Ko16rN1ZOFNu+WC/UB3lP0rB8sF+4f3M7JkL8mN1fthqRhbq+nhvN/7+v//+JY7jjIjY6GyvdLbjZPuH6vbqyfveFYvxjxuNNJn8pyvv+WcyXHoJcet45nji5KK8cPtdsVj9otWKPPm+WIxPW61yDFC/nu14Vyy+zkJdt47/9HY2EYPV4fX96w/vo+Q/XXnPP5NhlAFsoMGr87eahYvyMvLeAW2dc/zW4mJMz8/H1OxstPf343BvL37f2ekrk6H45T8lec8/k2GYAaxrkIvxRN4+1HnvgM5TX12NiPix59CThVevUormfPKfrnHNP+NlpN+d5OVivEqTWOcskf90yT8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAeCqkHQCTq1xeiog4SjhVqFa3L12Oy9MG6ZH70U2nHQATb9BJlMnW9dEG6ZH7ERjAcsasLTu0Rfq0QTqykvepkf8F0lBIeI1SLi1HSa9Kox5bEd1XpVE/t2wKMZ+W97bQBunJe+5Tz7sBjNR8treb+EGuNOrPI+J5RJQj4nlnf+D3MzhtkB65H93EJyBvyuWlxFlXpVEvdGZqERGxdmch1u4sJJatVrcz0e5bxxdoRMRK5+/GZbfvR1SvO87zjENbaIP02iDPuc9K3t2B5cwYztqGvnhvJLoLjFFbaIP05DL3Wcl72o3HJeV51nba1jnHby0uxvT8fEzNzkZ7fz8O9/bi952dxLL3ry+8jxqHttAG6bVBnnOflbx7CjGfcjlrO+28i6/++ecRET/2HHoSEbHw6tV1hzSMXLeFNkjPGOQ+9by7A8uZPM/axo22SJ82SEdW8u4OLGfGYNY2NrRF+rRBOuQdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgvhbQDYHDl8lJ3+0HpdizOfRKP7pbi6Ys38fXyXGwfFqPZno5ae+bMe6vV7ZsMdWS9dT1RmjqIuanDWJpuxbfvm/H2m2fx039qsdP8LTZru91yeasrMJyptAPg0o4i4miztnv0cn2j78T6h1rU2jNHJ2V6XnnVV49ae+Zo/UOtr8DL9Y3YrO2OQ12BS5pOO4A0dWb5SZ1eoXcWP2i5G1KIOL4De7S00nfi8b1SNNsHhaQ7sJzqWyEoTR3E0r1SRLS6x758vBI7zd8KvXdgwGSY6AGsY9Bl1Ewtt27WdmOzdnwHEhHx7ftmlMullKO6XrX2TNTax3eaERFPX7xJXGoEJoMlxPzpLpdVGvXYiui+Ko163/nI9zJiYj0GqDMwISZ9ABu2k0ylw3zYavbtVxr1ckSUI+J5RJQ7+2csH+xn6u5xEOfF/LE6n84RML5y17Fdpa/+9Of41/ztM4PQD9Xt1c7mRkSsRET8tbz06nS5z/Z2C9/9+sv1Btnj+2IxPm21nvcc6sZ30fa7YrH6RasVedKpazkGqF/PdrwrFl/nra7AcIYewHL6AESfreOZfMTlOsm+7fsR1euO88TW8Z+TAWzQWCMiqvevP7wr1anrMO3zOm91ZTB+RuJnJKeN+hBHLh+AOGXowetGojvr9cnGrcXF6vT8fEzNzkZ7f796uLcXv+/sRNzgoHrNqqf+TkKdudhRxPFDTP/8ebvw6O6z7on1D7Uol5cSJ8s3FdwV66tLrT0TP29vF5aW57rHXq5vnK5zXus6lEl/CrEa/R1fNSLi1uJiTM/PVzudZBzu7VU7nWREih3l6TuL+uefR0T82HPoycKrMyuduXTeXdQ41/mm5XQVxc9I/Iyka5QlxMQHGCqNeqHz0ENERKzdWYi1OwuJZavV7UzOFuqrqxGnOsmICB0l4+SinyAkDGAfLXfdkuLIYpxXYZS2yVtdRzH0Hdhne7uFpAcgKo1633c0lUY91u4sJL4/q2s+nYHqSdpxAGd0+5xKo16o9JxYO+5rznsyOJOT5Qucf4PQs59Q57zVcyRDD2Bf/fpL+atff/lLDPBdUdJTfRFR/s73FpCmYTvJXjfWYT5sNePfxT++/+n5CcVKRGycN1lePtjP7GT5PMsH+4X3M7NJNwgX1vlhqzlRneqo34Hl7QEIoCNvqygPW834205t9dTh3i/CVjqT5dM/I4m3NxLh1Xm8txt//99/k24QVuKP/nMl+m8Q4l2xGP+40UjTNfTsaeuc450HIKLnAYjoeQCij8edIT1+RpJdfkYymCu//fcABORDZwAbaRUlhQGsa5wny6PcIOStrqOYqC/8gD/kfRUlabI87hPlSazzRQxgQB+rKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQrv8DTzPVrzxg6gwAAAAASUVORK5CYII=";export{A as default};